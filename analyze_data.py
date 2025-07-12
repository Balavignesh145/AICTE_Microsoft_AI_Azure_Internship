import pandas as pd

if __name__ == "__main__":
    df = pd.read_csv("fake_job_detector/data/processed_job_postings.csv")
    print("Dataset shape:", df.shape)
    print("\nClass distribution:")
    print(df["fraudulent"].value_counts())


