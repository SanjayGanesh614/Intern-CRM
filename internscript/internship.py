# internship.py

import requests
import json
import os

def fetch_jobs():
    """Fetches job data from JSearch API and appends it to jobs_data.json."""

    url = "https://jsearch.p.rapidapi.com/search"
    
    # IMPORTANT: Put your actual RapidAPI key here
    headers = {
        "x-rapidapi-key": "721a1d5159mshe567e9dd3e9a48ep1f5af1jsn133a0d5ed151",
        "x-rapidapi-host": "jsearch.p.rapidapi.com"
    }

    # You can change this query later if you want
    querystring = {"query": "internship in india", "page": "1", "num_pages": "1"}
    
    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()  # This will raise an error for bad responses (like 401/403)
        data = response.json()

        existing_data = []
        if os.path.exists('jobs_data.json'):
            try:
                with open('jobs_data.json', 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
            except json.JSONDecodeError:
                existing_data = []
        
        if isinstance(existing_data, list):
            existing_data.append(data)
        else:
            existing_data = [existing_data, data]

        with open('jobs_data.json', 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, indent=4, ensure_ascii=False)
        
        return {"status": "success", "message": "Data fetched and appended to jobs_data.json"}

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401 or e.response.status_code == 403:
            return {"status": "error", "message": "Authentication Failed. Your API Key is invalid or has expired."}
        return {"status": "error", "message": str(e)}
    except Exception as e:
        return {"status": "error", "message": str(e)}
