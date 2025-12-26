from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
import sys
import json
from groq import Groq
from dotenv import load_dotenv
import io
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# -------------------------------------------------
# Paths
# -------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = BASE_DIR  # Backend directory
PARENT_DIR = os.path.dirname(BASE_DIR)  # Project root

# Ensure project root is on sys.path so "data" and "utils" can be imported
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from data.feature_columns import FEATURES
from utils.normalizer import normalize_input
from utils.mappings import (
    soil_npk_map,
    season_map,
    rainfall_map,
    weather_map,
    ph_map
)

# -------------------------------------------------
# Load .env
# -------------------------------------------------
load_dotenv(os.path.join(PARENT_DIR, ".env"))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Only initialize Groq client if key is present so that
# the backend can still start and serve prediction endpoints
# even when chatbot is not configured.
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# -------------------------------------------------
# FastAPI App
# -------------------------------------------------
app = FastAPI(title="Smart Agriculture API")

# CORS so frontend on Vercel can call this API
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://agro-vision-ai-six.vercel.app",
    "http://agro-vision-ai-six.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Globals (loaded on startup)
# -------------------------------------------------
crop_model = None
label_encoder = None
disease_model = None
DISEASE_CLASSES = None

# -------------------------------------------------
# Startup Event (SAFE MODEL LOADING)
# -------------------------------------------------
@app.on_event("startup")
def load_models():

    global crop_model, label_encoder, disease_model, DISEASE_CLASSES

    # Crop model
    meta = joblib.load(os.path.join(ROOT_DIR, "model_features.pkl"))
    crop_model = joblib.load(os.path.join(ROOT_DIR, "crop_recommendation_model.pkl"))
    label_encoder = meta["label_encoder"]

    # Disease model
    disease_model = load_model(
        os.path.join(ROOT_DIR, "plant_disease_finetuned.h5")
    )

    # Disease class names
    with open(os.path.join(PARENT_DIR, "data", "class_names.json")) as f:
        DISEASE_CLASSES = json.load(f)

    print("✅ Models loaded successfully")

# -------------------------------------------------
# Helpers
# -------------------------------------------------
def clean_name(name: str):
    return name.replace("_", " ").strip()

# -------------------------------------------------
# Health Check & Root
# -------------------------------------------------
@app.get("/healthz")
def health_check():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Smart Agriculture API is running"}

# -------------------------------------------------
# Crop Recommendation Endpoint
# -------------------------------------------------


class CropRequest(BaseModel):
    soil_type: str
    season: str
    rainfall_level: str
    weather: str
    ph_range: str


@app.post("/predict-crop")
def predict_crop(data: CropRequest):

    soil_type = normalize_input(data.soil_type, soil_npk_map)
    season = normalize_input(data.season, season_map)
    rainfall_level = normalize_input(data.rainfall_level, rainfall_map)
    weather = normalize_input(data.weather, weather_map)
    ph_range = normalize_input(data.ph_range, ph_map)

    if None in [soil_type, season, rainfall_level, weather, ph_range]:
        return {"error": "Invalid input value provided"}

    N, P, K = soil_npk_map[soil_type]
    temperature, humidity = weather_map[weather]
    rainfall = rainfall_map[rainfall_level]
    ph = ph_map[ph_range]

    input_df = pd.DataFrame(
        [[N, P, K, temperature, humidity, ph, rainfall]],
        columns=FEATURES
    )

    probs = crop_model.predict_proba(input_df)[0]
    classes = label_encoder.inverse_transform(
        np.arange(len(probs))
    )

    top3_idx = np.argsort(probs)[-3:][::-1]

    def independent_confidence(p, k=3.5):
        return (1 - np.exp(-k * p)) * 100

    return {
        "recommendations": [
            {
                "crop": classes[i],
                "confidence":round(float(independent_confidence(probs[i])), 2)
            }
            for i in top3_idx
        ]
    }

# -------------------------------------------------
# Disease Prediction Endpoint
# -------------------------------------------------
@app.post("/predict-disease")
async def predict_disease(file: UploadFile = File(...)):

    # Convert UploadFile to BytesIO
    contents = await file.read()
    img_bytes = io.BytesIO(contents)

    # Load image properly
    img = image.load_img(img_bytes, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict
    preds = disease_model.predict(img_array)[0]
    idx = int(np.argmax(preds))

    return {
        "disease": clean_name(DISEASE_CLASSES[idx]),
        "confidence": round(float(preds[idx] * 100), 2)
    }

# -------------------------------------------------
# Chat Schema
# -------------------------------------------------
class ChatRequest(BaseModel):
    question: str
    crop_result: dict | None = None
    disease_result: dict | None = None

# -------------------------------------------------
# Agriculture Chatbot
# -------------------------------------------------
@app.post("/chat")
def agriculture_chat(data: ChatRequest):

    if groq_client is None:
        return {
            "answer": "Chatbot is not configured on the server (missing GROQ_API_KEY). Crop and disease predictions still work."
        }

    system_prompt = """
    You are a professional agriculture expert and farmer assistant.
    Answer only agriculture-related questions.
    Use simple, farmer-friendly language.
    """

    context = ""
    if data.crop_result:
        context += f"\nCrop Recommendation:\n{data.crop_result}"
    if data.disease_result:
        context += f"\nDisease Detection:\n{data.disease_result}"

    user_prompt = f"""
    Farmer Question:
    {data.question}

    Context:
    {context}
    """

    response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.4,
    )

    return {"answer": response.choices[0].message.content}
