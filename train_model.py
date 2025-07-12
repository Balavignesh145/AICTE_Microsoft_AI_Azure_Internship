import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

if __name__ == "__main__":
    df = pd.read_csv("fake_job_detector/data/processed_job_postings.csv")

    # Combine relevant text columns for TF-IDF vectorization
    df["combined_text"] = df["title_processed"] + " " + \
                          df["company_profile_processed"] + " " + \
                          df["description_processed"] + " " + \
                          df["requirements_processed"] + " " + \
                          df["benefits_processed"]

    # Handle NaN values in combined_text before vectorization
    df["combined_text"] = df["combined_text"].fillna("")

    X = df["combined_text"]
    y = df["fraudulent"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(max_features=5000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # Train a Logistic Regression model
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train_tfidf, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test_tfidf)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Classification Report:\n", classification_report(y_test, y_pred))

    # Save the model and vectorizer (for later use in the application)
    import joblib
    joblib.dump(model, "fake_job_detector/models/logistic_regression_model.pkl")
    joblib.dump(vectorizer, "fake_job_detector/models/tfidf_vectorizer.pkl")
    print("Model and vectorizer saved.")


