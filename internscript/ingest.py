# ingest.py
import json
import sys
import os
import time

# Add the current directory to sys.path to ensure imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Force UTF-8 for stdout/stderr to handle emojis on Windows
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

from internship import fetch_jobs_data
from combine import transform_data

def main():
    try:
        # 1. Fetch Data
        raw_data = fetch_jobs_data()
        
        # Check for error in fetch
        if isinstance(raw_data, dict) and raw_data.get("status") == "error":
            print(json.dumps(raw_data))
            return

        # 2. Transform Data
        transformed_jobs = transform_data(raw_data)
        
        # Output the result as JSON to stdout
        print(json.dumps(transformed_jobs, indent=4, ensure_ascii=False))
        
    except Exception as e:
        import traceback
        with open("ingest_error.log", "w") as f:
            f.write(traceback.format_exc())
            f.write(f"\nMessage: {str(e)}")
        sys.stderr.write(traceback.format_exc())
        print(json.dumps({"status": "error", "message": "Internal Script Error - Check ingest_error.log"}))

if __name__ == "__main__":
    main()
