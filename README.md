## Agro Vision AI - Smart Agriculture Assistant

Agro Vision AI is a smart agriculture assistant that helps farmers and agronomists with:

- **Crop recommendation** based on soil, weather, rainfall, pH and season
- **Plant disease detection** from leaf images
- **Agriculture chatbot** that explains recommendations and answers farming questions

The project is built as a **FastAPI backend** with machine‑learning models and a **React + Vite frontend** styled with Tailwind CSS.

---

## Project Structure

- `backend/` – FastAPI app, ML models and prediction/chat endpoints
- `frontend/` – React + Vite single‑page app (Landing, Crop, Diseases, Chatbot pages)
- `data/` – feature definitions and class names for models
- `utils/` – input normalisation and mapping utilities
- `notebooks/` – Jupyter notebooks used for model training & experimentation

---

## Features

- **Crop Recommendation API** (`POST /predict-crop`)
	- Inputs: soil type, season, rainfall level, weather, pH range
	- Outputs: Top‑3 recommended crops with independent confidence scores

- **Plant Disease Detection API** (`POST /predict-disease`)
	- Input: leaf image file upload
	- Outputs: predicted disease class and confidence

- **Agriculture Chatbot API** (`POST /chat`)
	- Uses Groq LLM (`llama-3.1-8b-instant`) if a `GROQ_API_KEY` is configured
	- Can optionally receive crop and disease results as context

- **Frontend (React + Vite)**
	- Landing page summarising the platform
	- Crop recommendation UI
	- Disease image upload & result view
	- Integrated chatbot interface

---

## Backend Setup (FastAPI)

### 1. Create and activate a virtual environment (recommended)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # on Windows PowerShell
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment variables

Create a `.env` file in the project root (same level as `backend/` and `frontend/`):

```env
GROQ_API_KEY=your_groq_api_key_here  # optional but required for chatbot
```

The crop and disease prediction endpoints work even if `GROQ_API_KEY` is missing; only the chatbot will be disabled.

### 4. Make sure model files exist

In `backend/` you should have at least:

- `crop_recommendation_model.pkl`
- `model_features.pkl`
- `plant_disease_finetuned.h5`

And in `data/`:

- `class_names.json`

These are loaded automatically on backend startup.

### 5. Run the backend server

From the `backend/` directory:

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Useful endpoints:

- `GET /healthz` – health check
- `GET /` – basic API status
- `POST /predict-crop`
- `POST /predict-disease`
- `POST /chat`

---

## Frontend Setup (React + Vite)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure API base URL

Check `frontend/src/apiConfig.js` and update the backend URL if needed, for example:

```js
export const API_BASE_URL = "http://localhost:8000";
```

### 3. Run the development server

```bash
npm run dev
```

By default Vite runs on `http://localhost:5173` – this origin is already allowed by the backend CORS configuration.

---

## Production / Deployment Notes

- Backend is a standard FastAPI app and can be deployed to platforms like Render, Railway, or any VM with Python.
- Frontend is a static React + Vite app and can be deployed to Vercel, Netlify, etc.
- Ensure `CORS` in `backend/app.py` includes your deployed frontend domain.
- Set the `GROQ_API_KEY` environment variable in your production environment for the chatbot to work.

---

## Tech Stack

- **Backend:** FastAPI, NumPy, Pandas, scikit‑learn, TensorFlow, Groq API
- **Frontend:** React, Vite, React Router, Tailwind CSS, Framer Motion, Lucide Icons
- **ML:** Crop recommendation model, plant disease CNN, trained via notebooks in `notebooks/`

---

## License

This project is intended for educational and research purposes. Add a specific license here if you plan to open‑source or distribute it.

