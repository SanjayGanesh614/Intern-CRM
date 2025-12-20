
2. API ENDPOINT SPECIFICATIONS (REST)

Full endpoint design — organized by modules.

🔐 AUTHENTICATION
POST /auth/login

Body: email, password

Returns: JWT + user profile

POST /auth/logout

Invalidates user session

👥 USER MANAGEMENT
GET /users

Admin only — list all users.

POST /users

Create new user (admin).

PATCH /users/{user_id}

Update user details or role.

GET /users/{user_id}/load

Return active load count.

🏢 COMPANIES
GET /companies

Query companies (with filters: industry, size, search).

GET /companies/{company_id}

Get full profile + enrichment data.

POST /companies

Add new company (auto-created during fetch).

PATCH /companies/{company_id}

Update company info.

🎓 INTERNSHIPS
GET /internships

Queryable by:

status

internship type

location

source

assigned user

date range

search

Supports pagination & sorting.

GET /internships/{id}

Full internship + company info + activity & follow-ups.

PATCH /internships/{id}

Update fields (status, assignment, metadata).

DELETE /internships/{id}

Remove (admin only).

🛠️ FETCH EXECUTION
POST /fetch/run

Body:

mode: default/custom

threshold

internship_types

locations

sources

Triggers Python script and returns a session ID.

GET /fetch/status/{fetch_id}

Real-time progress polling.

POST /fetch/cancel/{fetch_id}

Stops the fetch process.

🔁 STATUS MANAGEMENT
PATCH /internships/{id}/status

Body:

new_status

remark (optional)

Automatically logs into internship_status_history.

📝 REMARKS
POST /internships/{id}/remarks

Add note.

GET /internships/{id}/remarks

Retrieve notes.

📆 FOLLOW-UPS
POST /internships/{id}/followups

Create follow-up.

GET /internships/{id}/followups

Get all follow-ups.

PATCH /followups/{followup_id}

Update due date or notes.

PATCH /followups/{followup_id}/complete

Mark follow-up done.

📊 ANALYTICS
GET /analytics/dashboard

Returns:

Companies contacted

Conversions

Leaderboards

Follow-ups due

Funnels

Industry distribution

GET /analytics/fetch-summary

Fetch session statistics.

🤖 AI OUTREACH
POST /ai/outreach/generate

Body:

internship_id

company_id

message_type (email/linkedin/followup)

tone

Response:

generated message

metadata

POST /ai/outreach/save

Stores generated content to database.

🔔 NOTIFICATIONS
GET /notifications

List notifications for logged-in user.

PATCH /notifications/{id}/read

Mark as read.

📚 ACTIVITY LOG
GET /internships/{id}/activity

Timeline view for UI drawer.

GET /companies/{id}/activity

For full company activity view.

🧩 BULK OPERATIONS
POST /internships/bulk/assign

Body: internship_ids[], user_id

POST /internships/bulk/status

Body: internship_ids[], new_status

POST /internships/bulk/export

Generates CSV/Excel.

POST /internships/bulk/outreach

Generates AI outreach messages at scale.