# combine.py

import json
import os

def extract_and_append_jobs():
    """
    Reads jobs_data.json, extracts key fields, and creates combined_jobs.json.
    """
    input_file = 'jobs_data.json'
    output_file = 'combined_jobs.json'

    if not os.path.exists(input_file):
        return {"status": "error", "message": "jobs_data.json not found. Please fetch jobs first."}

    with open(input_file, 'r', encoding='utf-8') as f:
        nested_json_list = json.load(f)

    all_selected_jobs = []
    processed_ids = set()

    # Load existing IDs from the output file to avoid duplicates
    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                for job in existing_data:
                    processed_ids.add(job.get('id'))
        except (json.JSONDecodeError, FileNotFoundError):
            existing_data = []
    else:
        existing_data = []

    for item in nested_json_list:
        if "data" in item and isinstance(item["data"], list):
            for job in item["data"]:
                job_id = job.get("job_id")
                if job_id and job_id not in processed_ids:
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
                    processed_ids.add(job_id)

    # Append new jobs to existing data and write back
    final_data = existing_data + all_selected_jobs
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=4, ensure_ascii=False)
    
    return {"status": "success", "message": f"Processed and added {len(all_selected_jobs)} new jobs."}

