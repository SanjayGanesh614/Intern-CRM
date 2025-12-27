# Intern CRM - Inside Sales Dashboard

A comprehensive dashboard for managing internship applications, tracking outreach, and leveraging AI for job analysis.

## Features

-   **Dashboard**: Overview of key metrics (Total Internships, Success Rate, Active Applications).
-   **Internship Tracking**: status updates, detailed views, and automated sorting.
-   **Analytics**: Visual insights into application activity and status distribution.
-   **Admin Settings**: User management and role-based access control.

## Tech Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts, Zustand.
-   **Backend**: Node.js, Express, MongoDB, Mongoose.
-   **Automation**: Python (Automation Script for fetchind data).

## Prerequisites

-   Node.js (v18+)
-   MongoDB (Running locally or Atlas URI)
-   Python 3.9+ (For fetch script)

## Setup

1.  **Clone the repository**
2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file with:
    # PORT=4000
    # MONGODB_URI=mongodb://localhost:27017/intern-crm
    # JWT_SECRET=your_super_secret_key_here
    # (You can generate one using: openssl rand -base64 32)
    npm run build
    npm start
    ```
3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run build
    npm run preview # or npm run dev
    ```

## Usage

-   **Admin Access**: The first user created is usually regular. Manually update role to 'admin' in DB or use the provided seed script (if applicable) to access `/users` and `/settings`.

## Project Structure

-   `backend/src`: API routes, models, services.
-   `frontend/src`: React components, pages, hooks.
-   `internscript`: Python automation scripts.
