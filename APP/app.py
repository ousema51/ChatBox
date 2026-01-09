from flask import Flask, request, jsonify
from flask_cors import CORS
import requests, os

app = Flask(__name__)
CORS(app)  # <-- ADD THIS

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

HF_Z_IMAGE_TURBO = "https://mrfakename-z-image-turbo.hf.space/run/predict"

conversations = {}

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    session_id = data.get("session_id")
    user_message = data.get("message")

    if not session_id or not user_message:
        return jsonify({"error": "Invalid request"}), 400

    if session_id not in conversations:
        conversations[session_id] = [
            {"role": "system", "content": "You are a helpful assistant."}
        ]

    conversations[session_id].append({
        "role": "user",
        "content": user_message
    })

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "deepseek/deepseek-chat",
            "messages": conversations[session_id]
        },
        timeout=30
    )

    ai_reply = response.json()["choices"][0]["message"]["content"]

    conversations[session_id].append({
        "role": "assistant",
        "content": ai_reply
    })

    return jsonify({ "reply": ai_reply })


@app.route("/api/image", methods=["POST"])
def image():
    prompt = request.json.get("prompt")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    payload = {
        "data": [
            prompt,
            1024,
            1024,
            9,
            42,
            True
        ]
    }

    response = requests.post(
        HF_Z_IMAGE_TURBO,
        json=payload,
        timeout=120
    )

    if response.status_code != 200:
        return jsonify({"error": "HF Space error"}), 500

    result = response.json()

    image_base64 = result["data"][0]["data"]

    return jsonify({ "image": image_base64 })
