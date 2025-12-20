# apps.py

from flask import Flask, jsonify, send_file
import os
from internship import fetch_jobs
from combine import extract_and_append_jobs

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({"status": "success", "message": "Job Scrapper API is running!"})

@app.route('/api/fetch-jobs', methods=['POST'])
def trigger_fetch_jobs():
    result = fetch_jobs()
    if result["status"] == "error":
        return jsonify(result), result.get("statusCode", 500)
    return jsonify(result)

@app.route('/api/process-jobs', methods=['POST'])
def trigger_process_jobs():
    result = extract_and_append_jobs()
    if result["status"] == "error":
        return jsonify(result), 404
    return jsonify(result)

@app.route('/api/jobs', methods=['GET'])
def get_combined_jobs():
    try:
        return send_file('combined_jobs.json', as_attachment=False)
    except FileNotFoundError:
        return jsonify({"status": "error", "message": "Jobs file not found. Run fetch and process first."}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5001)