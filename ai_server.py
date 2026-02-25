from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app) 

API_KEY = "HF_API_KEY" 
MODEL_URL = "https://router.huggingface.co/v1/responses"
MODEL_NAME = "Qwen/Qwen2.5-7B-Instruct"  # chat-capable model

@app.route("/chat", methods=["POST"])
def chat():
    user_text = request.json.get("message", "")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    body = {
        "model": MODEL_NAME,
        "instructions": "You are a tourism assistant for Mandalay, Myanmar. Only answer about Mandalay.",
        "input": user_text,
    }

    response = requests.post(MODEL_URL, headers=headers, json=body)

    print("STATUS:", response.status_code)
    print("RAW RESPONSE:", response.text)  

    if response.status_code != 200:
        return jsonify(
            {
                "reply": f"Hugging Face error {response.status_code}: {response.text}"
            }
        )

    try:
        data = response.json()
    except Exception:
        return jsonify({"reply": "API error. Could not parse JSON from Hugging Face."})

    if isinstance(data, dict) and "error" in data:
        err = data["error"]
        if isinstance(err, dict):
            msg = err.get("message") or err.get("code") or str(err)
        else:
            msg = str(err)
        return jsonify({"reply": f"Hugging Face error: {msg}"})

    reply = None
    if isinstance(data, dict):
        outputs = data.get("output", [])
        texts = []
        if isinstance(outputs, list):
            for item in outputs:
                if isinstance(item, dict) and item.get("type") == "output_text":
                    text_val = item.get("text")
                    if isinstance(text_val, str):
                        texts.append(text_val)
        if texts:
            reply = " ".join(texts)

    if not reply:
        reply = str(data)

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)