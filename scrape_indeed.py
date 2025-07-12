import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_indeed(job_title, location, num_pages=5):
    job_data = []
    for i in range(num_pages):
        url = f"https://www.indeed.com/jobs?q={job_title}&l={location}&start={i * 10}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.content, "html.parser")

        job_cards = soup.find_all("div", class_="job_seen_beacon")
        for card in job_cards:
            title = card.find("h2", class_="jobTitle").text.strip()
            company = card.find("span", class_="companyName").text.strip()
            location = card.find("div", class_="companyLocation").text.strip()
            try:
                salary = card.find("div", class_="salary-snippet-container").text.strip()
            except AttributeError:
                salary = "N/A"
            summary = card.find("div", class_="job-snippet").text.strip()
            job_data.append({
                "title": title,
                "company": company,
                "location": location,
                "salary": salary,
                "summary": summary
            })
    return pd.DataFrame(job_data)

if __name__ == "__main__":
    df = scrape_indeed("software engineer", "remote")
    df.to_csv("fake_job_detector/data/indeed_jobs.csv", index=False)
    print(f"Scraped {len(df)} jobs from Indeed.")


