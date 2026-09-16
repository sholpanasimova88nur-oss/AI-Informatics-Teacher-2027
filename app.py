import os
from flask import Flask, request, jsonify
from openai import OpenAI
app = Flask(__name__)
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)
@app.route("/")
def home():
    return "AI Informatics Teacher сервері жұмыс істеп тұр!"
@app.route("/ask", methods=["POST"])
def ask_ai():
    data = request.get_json()
    question = data.get("question", "").strip()
    if not question:
        return jsonify({
            "answer": "Сұрақты жазыңыз."
        })
    try:
        response = client.responses.create(
            model="gpt-5.6-luna",
            input=[
                {
                    "role": "system",
                    "content": (
                        "Сен AI Informatics Teacher атты "
                        "цифрлық ұстазсың. "
                        "Оқушыға түсінікті қазақ тілінде жауап бер. "
                        "Қажет болса мысал, алгоритм және Python кодын көрсет. "
                        "Оқушының сұрағын түсінікті әрі қадамдық түрде түсіндір."
                    )
                },
                {
                    "role": "user",
                    "content": question
                }
            ]
        )
        return jsonify({
            "answer": response.output_text
        })
    except Exception as e:
        return jsonify({
            "answer": "ЖИ-мен байланыс кезінде қате пайда болды.",
            "error": str(e)
        }), 500
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )
