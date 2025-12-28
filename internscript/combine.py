# combine.py

import json



def transform_data(raw_data):
    """
    Transforms raw API data into the desired format without file operations.
    Args:
        raw_data (dict or list): The raw JSON response from the API.
    Returns:
        list: A list of transformed job dictionaries.
    """
    all_selected_jobs = []
    
    # Handle both single dict response (one page) and list of dicts (if we merged multiple)
    if isinstance(raw_data, dict):
        items_list = [raw_data]
    elif isinstance(raw_data, list):
        items_list = raw_data
    else:
        return []

    for item in items_list:
        if "data" in item and isinstance(item["data"], list):
            for job in item["data"]:
                job_id = job.get("job_id")
                if job_id:
                    selected = {
                        "id": job_id,
                        "title": job.get("job_title"),
                        "company": job.get("employer_name"),
                        "website": job.get("employer_website"),
                        "location": job.get("job_location"),
                        "city": job.get("job_city"),
                        "state": job.get("job_state"),
                        "country": job.get("job_country"),
                        "type": job.get("job_employment_type"),
                        "apply_link": job.get("job_apply_link"),
                        "description": job.get("job_description") or "",
                        "posted_at": job.get("job_posted_at"),
                        "publisher": job.get("job_publisher")
                    }
                    all_selected_jobs.append(selected)
    
    return all_selected_jobs

