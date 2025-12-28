# internship.py

import requests
import json
import os



def fetch_jobs_data():
    """Fetches job data from JSearch API loop and returns a list of responses."""
    import time
    
    url = "https://jsearch.p.rapidapi.com/search"
    api_key = os.environ.get("RAPIDAPI_KEY")
    if not api_key:
        return {"status": "error", "message": "RAPIDAPI_KEY not set"}
    headers = {"x-rapidapi-key": api_key, "x-rapidapi-host": "jsearch.p.rapidapi.com"}
    
    all_responses = []
    # Fetch 3 pages (approx 30 jobs)
    for page in range(1, 11):
        querystring = {"query": "internship in india", "page": str(page), "num_pages": "1"}
        
        try:
            response = requests.get(url, headers=headers, params=querystring)
            response.raise_for_status()
            all_responses.append(response.json())
        except Exception as e:
            return {"status": "error", "message": f"Page {page} failed: {str(e)}"}
        
        time.sleep(1) # Rate limit friendliness

    return all_responses
