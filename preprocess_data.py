import pandas as pd
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

def preprocess_text(text):
    if isinstance(text, str):
        text = text.lower()
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text) # Remove special characters
        tokens = word_tokenize(text)
        stop_words = set(stopwords.words('english'))
        filtered_tokens = [word for word in tokens if word not in stop_words]
        return " ".join(filtered_tokens)
    return ""

def apply_heuristics(df):
    # Heuristic 1: Suspicious salary (e.g., very high or vague)
    df['heuristic_salary'] = df['salary_range'].apply(lambda x: 1 if pd.isna(x) or 'negotiable' in str(x).lower() or 'unspecified' in str(x).lower() else 0)

    # Heuristic 2: Generic job titles or descriptions (requires more advanced NLP, for now, simple keyword check)
    generic_keywords = ['manager', 'associate', 'specialist', 'representative', 'consultant']
    df['heuristic_generic_title'] = df['title'].apply(lambda x: 1 if any(keyword in str(x).lower() for keyword in generic_keywords) else 0)

    # Heuristic 3: Missing essential information (e.g., department, employment_type, required_experience)
    df['heuristic_missing_info'] = df[['department', 'employment_type', 'required_experience']].isnull().any(axis=1).astype(int)

    # Heuristic 4: Company profile completeness
    df['heuristic_company_incomplete'] = df[['company_profile', 'description']].isnull().any(axis=1).astype(int)

    # Combine heuristics for a 'heuristic_label' (can be refined later)
    df['heuristic_label'] = ((df['heuristic_salary'] + df['heuristic_generic_title'] + df['heuristic_missing_info'] + df['heuristic_company_incomplete']) > 0).astype(int)
    return df

if __name__ == "__main__":
    df = pd.read_csv("fake_job_detector/data/fake_job_postings.csv")

    # Fill NaN values with empty strings for text columns to avoid errors during preprocessing
    text_cols = ['title', 'location', 'department', 'salary_range', 'company_profile', 'description', 'requirements', 'benefits', 'employment_type', 'required_experience', 'industry', 'function']
    for col in text_cols:
        df[col] = df[col].fillna('')

    # Preprocess text columns
    for col in ['title', 'company_profile', 'description', 'requirements', 'benefits']:
        df[f'{col}_processed'] = df[col].apply(preprocess_text)

    # Apply heuristics
    df = apply_heuristics(df)

    df.to_csv("fake_job_detector/data/processed_job_postings.csv", index=False)
    print("Data preprocessing and heuristic labeling complete. Saved to processed_job_postings.csv")
    print(df.head())


