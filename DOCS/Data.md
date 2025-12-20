1. FULL DATABASE SCHEMA (DETAILED, NORMALIZED, SCALABLE)

Below is the final relational-style schema (but works perfectly for MongoDB, Postgres, or a hybrid).

📌 TABLE: users

Stores all platform users (admins, sales reps, CRM operators)
| Field         | Type                       | Description                           |
| ------------- | -------------------------- | ------------------------------------- |
| user_id (PK)  | UUID                       | Unique identifier                     |
| name          | String                     | Full name                             |
| email         | String (unique)            | Login email                           |
| password_hash | String                     | Hashed password                       |
| role          | Enum(admin, sales, viewer) | Controls permissions                  |
| active_load   | Integer                    | Count of companies currently assigned |
| created_at    | Timestamp                  | User creation                         |
| updated_at    | Timestamp                  | Last update                           |
📌 TABLE: companies

Enriched company information extracted from internship fetch data.
| Field             | Type      | Description                            |
| ----------------- | --------- | -------------------------------------- |
| company_id (PK)   | UUID      | Unique company identifier              |
| name              | String    | Company name                           |
| website           | String    | URL                                    |
| industry          | String    | Industry classification                |
| size              | String    | Company size (e.g., 1–10, 11–50, etc.) |
| headquarters      | String    | Location (if extractable)              |
| linkedin_url      | String    | Optional                               |
| enrichment_source | JSON      | Enriched metadata                      |
| created_at        | Timestamp | When company was added                 |
| updated_at        | Timestamp | When last enriched                     |

📌 TABLE: internships

Raw internship entries extracted from fetch script.
| Field              | Type      | Description                     |
| ------------------ | --------- | ------------------------------- |
| internship_id (PK) | UUID      | Unique ID                       |
| company_id (FK)    | UUID      | Links to companies table        |
| title              | String    | Internship title                |
| internship_type    | String    | Tech, Marketing, etc.           |
| location           | String    | Remote/Hybrid/On-site           |
| start_date         | Date      | Optional                        |
| end_date           | Date      | Optional                        |
| source             | String    | LinkedIn, Internshala, etc.     |
| source_url         | String    | Link to original posting        |
| fetched_at         | Timestamp | When the internship was fetched |
| status             | Enum      | Sales status (below)            |
| assigned_to (FK)   | UUID      | Sales rep assigned              |
| last_contacted     | Timestamp | Optional                        |
| follow_up_date     | Date      | Optional                        |
📌 TABLE: internship_status_history

Full historical log of all status changes.
| Field              | Type      | Description      |
| ------------------ | --------- | ---------------- |
| history_id (PK)    | UUID      | Unique record    |
| internship_id (FK) | UUID      | Which internship |
| previous_status    | String    | Before change    |
| new_status         | String    | After change     |
| updated_by (FK)    | UUID      | User who changed |
| remark             | String    | Optional         |
| created_at         | Timestamp | Time of update   |
📌 TABLE: remarks

Stores notes/comments made by sales reps.
| Field              | Type      | Description            |
| ------------------ | --------- | ---------------------- |
| remark_id (PK)     | UUID      | Unique ID              |
| internship_id (FK) | UUID      | Attached to internship |
| user_id (FK)       | UUID      | Creator                |
| note               | Text      | The remark             |
| created_at         | Timestamp | Added at               |
📌 TABLE: follow_ups

Handles reminders & tasks.
| Field              | Type      | Description             |
| ------------------ | --------- | ----------------------- |
| followup_id (PK)   | UUID      | Unique ID               |
| internship_id (FK) | UUID      | Which internship        |
| user_id (FK)       | UUID      | Assigned user           |
| due_date           | Date      | Follow-up date          |
| notes              | String    | Follow-up notes         |
| reminder_sent      | Boolean   | Was reminder triggered? |
| created_at         | Timestamp |                         |
| updated_at         | Timestamp |                         |
📌 TABLE: activity_log

Records all system activities for auditability.
| Field              | Type                                                                                                            | Description            |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------- |
| activity_id        | UUID                                                                                                            | Unique activity        |
| user_id (FK)       | UUID                                                                                                            | User performing action |
| internship_id (FK) | UUID                                                                                                            | Affected internship    |
| company_id (FK)    | UUID                                                                                                            | Optional               |
| action_type        | Enum(status_change, note_added, assigned, ai_message_sent, fetch_completed, followup_created, followup_updated) | Type of action         |
| metadata           | JSON                                                                                                            | Extra data             |
| created_at         | Timestamp                                                                                                       |                        |
📌 TABLE: ai_outreach_history

Stores AI-generated messages.
| Field              | Type                                     | Description              |
| ------------------ | ---------------------------------------- | ------------------------ |
| message_id (PK)    | UUID                                     | Unique                   |
| internship_id (FK) | UUID                                     | Target internship        |
| company_id (FK)    | UUID                                     | Target company           |
| user_id (FK)       | UUID                                     | Who generated            |
| message_text       | Text                                     | The AI-generated content |
| message_type       | Enum(email, linkedin, followup, general) |                          |
| created_at         | Timestamp                                |                          |
📌 TABLE: fetch_log

Tracks every execution of the fetch script.
| Field         | Type                             | Description        |
| ------------- | -------------------------------- | ------------------ |
| fetch_id (PK) | UUID                             | Fetch session      |
| trigger_type  | Enum(manual, scheduled)          | How it started     |
| total_fetched | Integer                          | Count              |
| valid_entries | Integer                          | After filtering    |
| duplicates    | Integer                          | Duplicates removed |
| started_at    | Timestamp                        |                    |
| completed_at  | Timestamp                        |                    |
| status        | Enum(success, failed, cancelled) |                    |


