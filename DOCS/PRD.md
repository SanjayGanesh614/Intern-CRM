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

The CRM Dashboard must be built using the following technologies:

8.1 Frontend
Framework: React (Latest Version)

The UI must be developed using React, chosen for:

Component-based UI structure

Strong compatibility with Firebase

Easy integration of tables, modals, drawers, dashboards

High performance for real-time Firestore-powered interfaces

Native compatibility with Firebase Studio’s AI code generation capabilities

Additional frontend dependencies:

React Router (navigation)

TailwindCSS or Material UI (UI styling — builder may choose)

Zustand / Redux (state management)

react-table or MUI DataGrid (for internship table)

8.2 Backend

Backend must be implemented entirely using Firebase services:

1. Firebase Firestore (Database)

Stores internship data

Stores company data

Stores activity logs

Stores assignments, remarks, follow-ups

Stores AI outreach messages

Uses Firestore indexes for efficient filtering & pagination

2. Firebase Cloud Functions (Server-side logic)

Implements all API endpoints outlined in API_SPEC.md, including:

Internship fetch execution

Status updates

Assignments

AI outreach generator invocation

Follow-up handling

Notifications

Scheduled tasks

Cloud Functions serve as the backend API layer.

3. Firebase Authentication

Used for:

Admin/user login

Role-based access control

Restricting database reads & writes according to user roles

4. Firebase Cloud Scheduler

Used to automate:

Scheduled internship fetches

Daily follow-up reminders

Notification triggers

5. Firebase Hosting

React app deployed on Firebase Hosting (CDN-backed, HTTPS).

8.3 Real-Time Architecture

The system must leverage React + Firestore’s native real-time capabilities:

Internship table updates in real-time as statuses change

Progress screen updates dynamically during fetch

Notifications appear immediately

Assignments and follow-ups sync instantly

8.4 AI Integration Layer

AI features must operate through Cloud Functions:

/ai/outreach/generate

/ai/status/suggest

/ai/followup/suggest

Every AI message must save to Firestore.

8.5 Why React + Firebase (Rationale)

This stack is mandatory for:

Best compatibility with Firebase Studio AI Code Editor

Simplified infrastructure (no backend server to manage)

Real-time CRM features

Scalability for high-volume data (tens of thousands of internships)

Strong developer ecosystem

Fast feature iteration

This is the official stack for implementation.

✔️ THE PRD IS COMPLETE.