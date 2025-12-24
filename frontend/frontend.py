import streamlit as st
import requests

# ---------------- PAGE CONFIG ----------------
st.set_page_config(
    page_title="🌾 Smart Agriculture System",
    layout="centered"
)

st.title("🌾 Smart Agriculture System")

BACKEND_URL = "http://127.0.0.1:8000"

# ======================================================
# SESSION STATE
# ======================================================
if "crop_result" not in st.session_state:
    st.session_state.crop_result = None

if "disease_result" not in st.session_state:
    st.session_state.disease_result = None

if "chat" not in st.session_state:
    st.session_state.chat = []

# ======================================================
# 1️⃣ CROP RECOMMENDATION
# ======================================================
st.header("🌱 Crop Recommendation")

soil_type = st.selectbox(
    "Soil Type",
    ["Sandy", "Loamy", "Clay", "Black", "Red"]
)

season = st.selectbox(
    "Season",
    ["Winter", "Summer", "Monsoon"]
)

rainfall = st.selectbox(
    "Rainfall Level",
    ["Low", "Medium", "High"]
)

weather = st.selectbox(
    "Weather",
    ["Cool & Dry", "Warm", "Hot & Humid", "Sunny"]
)

ph = st.selectbox(
    "Soil pH",
    ["Acidic", "Neutral", "Alkaline"]
)

if st.button("🌱 Recommend Crops"):
    response = requests.post(
        f"{BACKEND_URL}/predict-crop",
        params={
            "soil_type": soil_type,
            "season": season,
            "rainfall_level": rainfall,
            "weather": weather,
            "ph_range": ph
        }
    )

    if response.status_code == 200:
        data = response.json()
        st.session_state.crop_result = data

        st.subheader("✅ Top Crop Recommendations")
        for i, rec in enumerate(data["recommendations"], 1):
            st.success(
                f"{i}. **{rec['crop'].title()}** — {rec['confidence']}%"
            )
    else:
        st.error("❌ Backend not responding")

# ======================================================
# 2️⃣ DISEASE DETECTION
# ======================================================
st.divider()
st.header("🦠 Plant Disease Detection")

uploaded_file = st.file_uploader(
    "Upload plant leaf image",
    type=["jpg", "jpeg", "png"]
)

if uploaded_file and st.button("🔍 Detect Disease"):
    files = {"file": uploaded_file}

    response = requests.post(
        f"{BACKEND_URL}/predict-disease",
        files=files
    )

    if response.status_code == 200:
        data = response.json()
        st.session_state.disease_result = data

        st.image(uploaded_file, caption="Uploaded Image", width=300)
        st.success(
            f"**Disease:** {data['disease']}\n\n"
            f"**Confidence:** {data['confidence']}%"
        )
    else:
        st.error("❌ Disease detection failed")

# ======================================================
# 3️⃣ AGRICULTURE CHATBOT
# ======================================================
st.divider()
st.header("💬 Agriculture Chatbot")

# Show previous messages with delete option
for idx, msg in enumerate(st.session_state.chat):
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

        # Show delete button only for user messages
        if msg["role"] == "user":
            if st.button("🗑️ Delete", key=f"del_{idx}"):
                st.session_state.chat.pop(idx)
                # also remove assistant reply if exists
                if idx < len(st.session_state.chat):
                    if st.session_state.chat[idx]["role"] == "assistant":
                        st.session_state.chat.pop(idx)
                st.rerun()

question = st.chat_input("Ask any agriculture-related question...")

if question:
    # Add user message
    st.session_state.chat.append(
        {"role": "user", "content": question}
    )

    payload = {
        "question": question,
        "crop_result": st.session_state.crop_result,
        "disease_result": st.session_state.disease_result
    }

    response = requests.post(
        f"{BACKEND_URL}/chat",
        json=payload
    )

    if response.status_code == 200:
        answer = response.json()["answer"]
    else:
        answer = "❌ Chatbot service unavailable."

    # Add assistant reply
    st.session_state.chat.append(
        {"role": "assistant", "content": answer}
    )

    st.rerun()
