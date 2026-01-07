from flask import Flask, request, jsonify
import requests, os, uuid

app = Flask(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

conversations = {}

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    session_id = data.get("session_id")
    user_message = data.get("message")

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
        }
    )

    ai_reply = response.json()["choices"][0]["message"]["content"]

    conversations[session_id].append({
        "role": "assistant",
        "content": ai_reply
    })

    return jsonify({"reply": ai_reply})
