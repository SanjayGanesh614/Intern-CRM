PRODUCT REQUIREMENTS DOCUMENT (PRD)
CRM Dashboard for Internship Fetching + Company Outreach & Onboarding
1. Overview
1.1 Purpose

This CRM system centralizes the process of fetching internships, managing internship data, and supporting sales teams as they onboard companies to the internship platform.
It combines an internship pipeline (their requirement) with a company outreach & sales CRM (our requirement) into a single integrated workflow.

The system provides:

Automated internship fetching

Internship management table

Assignment, notes, statuses, and follow-up management

Company profile enrichment

AI-powered outreach assistance

Sales analytics and team performance visibility

1.2 Primary Users

Sales Team — Contact companies, update statuses, add remarks, manage follow-ups

Admin / Ops Team — Configure fetch settings, manage users, view analytics

Fetcher/Automation System — Runs internship-fetch Python scripts

1.3 Key Outcomes

Reduce manual internship sourcing work

Provide a unified table to manage internships & company leads

Improve company onboarding efficiency

Provide structured workflow management for sales teams

Enable AI-driven communication & prioritization

2. Scope
2.1 In Scope

End-to-end internship fetching

Internship viewing, filtering, sorting, exporting

Company enrichment from internship fetch results

CRM-style features: statuses, notes, assignments, follow-ups

AI outreach

Analytics dashboard

Admin settings

Notifications

2.2 Out of Scope

Frontend mobile apps

Payment integrations

Internship application/processing by students

3. System Workflow
3.1 Dashboard (Entry Point)

Displays system-level KPIs.

Cards Required:

Total Internships

New Internships (Last 24h)

In Progress

Converted

Additional Sales KPIs:

Companies Contacted Today

Onboarded Companies

Pending Follow-ups

Sales Team Activity

Actions:

+ Fetch Internships

View All Internships

3.2 Fetch Internships Modal

The modal must include:

Mode Selection

Default Fetch

Custom Fetch

Default Fetch

Runs with saved admin settings

One-click execution

Custom Fetch Fields

Threshold (maximum internships to fetch)

Internship Type (multi-select: Tech, Marketing, Design, Cybersecurity, Business, Others)

Location Filter (Remote, On-Site, Hybrid)

Sources (LinkedIn, Internshala, Company Careers, Custom Sources)

Buttons

Preview Count

Start Fetch

Backend Behavior

Executes the Python fetch script

Deduplicates internships

Adds or updates company records

3.3 Fetch Progress Screen
Elements:

Progress bar

Counters:

Total fetched

Valid

Duplicates skipped

Cancel Fetch

Completion State:

Toast: “X internships added successfully”

CTA: Go to Internship List

Sales Enhancements:

Track newly discovered companies

Auto-notify assigned sales reps

3.4 Internship List View (Main Screen)
Table Columns

(Show all with column visibility toggle)

Company Name

Internship Title

Internship Type

Start Date

End Date

Source

Fetched Timestamp

Sales Status (color-coded)

Assigned To

(Optional) Last Contacted

(Optional) Follow-up Date

(Optional) Outreach Notes

Actions

Sales Status Colors

Unassigned – Grey

Contacted – Blue

Follow-up – Yellow

Meeting Scheduled – Purple

Interested – Green

Not Interested – Red

Onboarded – Dark Green

Rejected – Black

Actions

Open Detail Drawer

Status update

Assign user

Generate AI Message

Export

Bulk Actions

Bulk assign

Bulk status update

Bulk export

Bulk AI outreach

3.5 Detail Drawer (Slide-In Panel)

Opens on row click.

Tab 1: Details

Internship metadata

Source link

Timestamps

Button: Open Company Profile

Company name

Industry

Size

Website

Social links

Hiring history (if available)

Tab 2: Remarks & Activity

Add remark box

Activity timeline:

Notes

Status changes

Assignments

AI messages sent

Timestamps

User attribution

Tab 3: Follow-Up

Date picker

Reminder toggle

Notes field

AI suggested follow-up timing

3.6 Assignment Flow
Requirements:

Assign To dropdown

Shows rep name + active load count

Instant update

Add auto-assign (round robin / industry-based)

3.7 Status Update Flow
Requirements:

Inline dropdown

Color-coded statuses

Optional remark modal for critical statuses

AI-suggested next steps

3.8 Notifications
Required Triggers:

Fetch completed

Follow-up due today

New company detected

Follow-up overdue

Status updated by another user

Company responded (manual entry)

Internship untouched for X days

Supported channels:

In-app

Email (admin optional)

3.9 Admin Settings

Default fetch threshold

Default internship types

Default sources

Auto-fetch toggle

Scheduled fetch time

User management

Outreach default templates

Column visibility presets

Dark/Light mode toggle

3.10 Analytics Dashboard
KPIs:

Companies contacted

Conversions (company onboarded)

Team leaderboard

Industry-based performance

Daily/weekly outreach trend

Follow-ups pending

Graph Types:

Bar charts

Line charts

Funnel chart

Pie chart

4. Technical Requirements
4.1 Backend

Python-based ingestion script execution endpoint

REST or GraphQL API

CRUD operations for:

Internships

Companies

Notes

Assignments

Status updates

Users

Notifications

Activity logs

Scheduler for auto-fetch

WebSocket for live updates

4.2 Database Schema (High-Level)
Internships

internship_id

company_id

title

type

location

start_date

end_date

source

fetched_at

Companies

company_id

name

size

industry

website

created_at

enrichment_data

Sales Pipeline

internship_id / company_id

status

assigned_to

last_contacted

follow_up_date

notes

Activity Logs

user

action

timestamp

related entity

AI Outreach

message_text

generated_for_company

timestamp

Users

role

permissions

email

activity stats

4.3 AI Requirements

Personalized outreach email generation

LinkedIn message generation

Status recommendation engine

Follow-up timing prediction

Auto-fill using company fields

5. Non-Functional Requirements
Performance

Table must handle 50k+ internship rows efficiently

Fetch script must run asynchronously

Real-time updates must not impact UI speed

Security

JWT or session token authentication

Role-based access (Admin, Sales Rep, Viewer)

Secure execution of Python script

Reliability

Auto-retry failed fetches

Activity logs must persist

Notifications must be reliable

Scalability

Backend and frontend must support feature expansion

Modular API design

Company and internship tables must scale independently

6. Deliverables

The engineering output must include:

UI screens (Figma or implementation)

Component architecture

Backend API schemas

Database schema

Cron + fetch executor

Websocket implementation for real-time updates

AI integration pipelines

Deployable environment configs

7. Success Metrics

Internship fetch accuracy > 95%

Company onboarding time reduced by 50%

Sales team productivity improved by 30%

Follow-up completion rate > 90%

<2 seconds load time for internship table

8. Technology Stack (MANDATORY)

The CRM Dashboard must be built using the following technologies.
This stack is final and must be adhered to strictly by all builders and AI agents.

8.1 Frontend
Framework: React (Latest Stable Version)

The user interface must be developed using React, chosen for:

Component-based architecture suitable for complex dashboards

Excellent support for large data tables, modals, drawers, and side panels

Strong ecosystem for admin/CRM-style applications

Predictable state management for multi-user workflows

Easy integration with REST APIs and real-time updates (polling or WebSockets)

Frontend Dependencies (Mandatory / Allowed)

React Router — client-side navigation

TailwindCSS or Material UI — UI styling (builder may choose one)

Zustand or Redux Toolkit — global state management

react-table or MUI DataGrid — high-performance internship/company tables

Axios / Fetch API — backend communication

The frontend must be fully decoupled from backend implementation details.

8.2 Backend
Backend Framework

The backend must be implemented using one of the following:

Node.js (Express or Fastify)
OR

Python (FastAPI)

The choice must prioritize:

Clean REST API design

Async support for long-running tasks

Easy integration with Python-based fetch scripts

Database: MongoDB (Primary Data Store)

MongoDB is the single source of truth for all application data.

MongoDB must store:

Internship data

Company data

User accounts and roles

Sales pipeline status

Assignments

Remarks and activity logs

Follow-ups and reminders

AI-generated outreach messages

Fetch execution logs and progress tracking

MongoDB Requirements

Schemas must strictly follow Data.md

Proper indexes must be created for:

status

assigned_to

company_id

follow_up_date

fetched_at

Use upserts for company enrichment

Avoid unbounded collection scans

8.2.1 Python Fetch Script Integration (Mandatory)

The existing Python internship fetch script must be integrated into the backend as a server-side job, never executed from the frontend.

Accepted integration approaches:

Backend triggers Python via subprocess

Background worker / job queue (preferred for scale)

Responsibilities of the Python script integration:

Fetch internships from external sources

Deduplicate records

Insert internships into MongoDB

Extract and upsert companies into the companies collection

Track fetch progress (%)

Write fetch metadata to a fetch_log collection

Support cancellation and retry

8.3 Authentication & Authorization

Authentication must be implemented using one of the following:

Custom JWT-based authentication

OR a managed auth provider (e.g., Auth0, Clerk, Cognito)

Authorization requirements:

Role-based access control:

Admin

Sales

Viewer

API-level enforcement of permissions

No direct database access from the frontend

8.4 Real-Time & Near–Real-Time Updates

The system must support near real-time UI updates using one or more of the following:

WebSockets

Server-Sent Events (SSE)

Polling with optimized intervals

Used for:

Fetch progress updates

Status changes

Assignment updates

Notifications

Follow-up reminders

Real-time behavior must be handled at the API layer, not in the database.

8.5 AI Integration Layer

AI features must operate through backend APIs, never directly from the frontend.

Required AI endpoints (as defined in api.md):

/ai/outreach/generate

/ai/status/suggest

/ai/followup/suggest

AI integration rules:

AI may only use data already present in MongoDB

All AI-generated outputs must be persisted

Every AI action must be logged with timestamps and user context

8.6 Why React + Custom Backend + MongoDB (Rationale)

This stack is mandatory because it provides:

Full control over backend logic and long-running jobs

Native support for Python-based data ingestion pipelines

Better scalability for high-volume internship data

Clear separation of concerns (UI, API, data layer)

Easier future migration to microservices if needed

Independence from vendor lock-in (Firebase)

Strong compatibility with modern AI-assisted code editors

This is the official and final implementation stack for the project.

✔️ THE PRD IS COMPLETE.