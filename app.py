from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

app = Flask(__name__)
CORS(app) # Enable CORS for all origins

# Load the trained model and vectorizer
model = joblib.load("../models/logistic_regression_model_balanced.pkl")
vectorizer = joblib.load("../models/tfidf_vectorizer_balanced.pkl")

def preprocess_text(text):
    if isinstance(text, str):
        text = text.lower()
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text) # Remove special characters
        tokens = word_tokenize(text)
        stop_words = set(stopwords.words('english'))
        filtered_tokens = [word for word in tokens if word not in stop_words]
        return " ".join(filtered_tokens)
    return ""

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    job_post_text = data.get("job_post_text", "")

    processed_text = preprocess_text(job_post_text)
    vectorized_text = vectorizer.transform([processed_text])

    prediction = model.predict(vectorized_text)[0]
    prediction_proba = model.predict_proba(vectorized_text)[0].tolist()

    result = {
        "prediction": int(prediction),
        "prediction_proba": prediction_proba,
        "is_fake": bool(prediction)
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)


