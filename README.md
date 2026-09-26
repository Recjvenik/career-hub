# GoTechPlace - Student Career & Project Platform

Production-quality MVP web application for college students aged 18–25, featuring student registration/profile management, personalized student dashboard, branch-wise Minor/Major project marketplace, project booking flow, job & internship opportunities, and isolated Google Sheets database backend via Netlify Serverless Functions.

---

## 1. Product Overview

GoTechPlace brings together:
- **Welcome & Identity Verification**: Google Sign-In identity authentication.
- **Multi-step Registration**: Captures student personal and academic details (College, Branch, Year, Semester).
- **Personalized Student Dashboard**: Displays profile completion status, quick action cards, recommended projects, and tailored job opportunities.
- **Branch-Wise Projects Marketplace**: Minor and Major hardware & software projects with full specifications, component lists, and transparent pricing.
- **Project Booking**: Immediate project reservation flow with duplicate check and PENDING status tracking.
- **Jobs & Opportunities**: Curated internships and job openings with branch eligibility filtering and secure external application redirects.
- **Student Profile**: Comprehensive profile card with inline edit modal and live synchronization.

---

## 2. Tech Stack

- **Frontend**: React 18, Vite 6, TypeScript 5, Tailwind CSS 3, Lucide React Icons
- **Routing**: React Router DOM v6 with Netlify SPA Redirects (`netlify.toml`)
- **Authentication**: `@react-oauth/google` with built-in developer fallback
- **Serverless API**: Netlify Functions (`netlify/functions/api.ts`)
- **Backend Datastore**: Google Sheets API v4 (`googleapis` client) with high-fidelity server & client fallback datastores (`MockDb`)

---

## 3. Architecture & Strict Decoupling

Frontend React components **NEVER** communicate directly with Google Sheets.

```
React Frontend
      │
      ▼ HTTP Requests (/api/*)
Netlify Functions Backend (api.ts)
      │
      ├───────────────────────────────┐
      ▼ (Env Configured)              ▼ (Env Missing / Dev Mode)
Google Sheets API v4              Mock Database Service (MockDb)
      │                               │
      ▼                               ▼
Google Spreadsheet              In-Memory / Local Storage Datastore
```

### Supported API Endpoints
- `GET /api/student?google_id=...` or `GET /api/student?student_id=...`
- `POST /api/student` / `PUT /api/student`
- `GET /api/projects?branch=...&type=...&search=...`
- `GET /api/projects/:id`
- `POST /api/project-bookings`
- `GET /api/project-bookings?student_id=...`
- `GET /api/jobs?branch=...&job_type=...&search=...`
- `GET /api/jobs/:id`

---

## 4. Google Sheets Database Schema

When Google Sheets credentials are provided, the backend reads and writes to a single Google Spreadsheet with 5 tabs:

1. **`Students`**: `student_id`, `google_id`, `email`, `name`, `mobile`, `location`, `gender`, `college`, `branch`, `year`, `semester`, `profile_image`, `created_at`, `updated_at`
2. **`Projects`**: `project_id`, `title`, `description`, `branch`, `project_type`, `technologies`, `difficulty`, `duration`, `cost`, `availability`, `capacity`, `image`, `created_at`, `updated_at`
3. **`ProjectBookings`**: `booking_id`, `student_id`, `project_id`, `status`, `booked_at`, `updated_at`
4. **`Jobs`**: `job_id`, `company`, `role`, `job_type`, `description`, `eligibility`, `location`, `skills`, `experience`, `deadline`, `apply_url`, `company_logo`, `created_at`, `updated_at`
5. **`JobApplications`**: `application_id`, `student_id`, `job_id`, `status`, `applied_at`

---

## 5. Local Setup & Running

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Running Locally (Development Mode)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

The application works 100% out of the box in development mode using the high-fidelity Mock Database service. No external API keys or Google credentials are required to start developing!

---

## 6. Environment Variables Setup

Create a `.env` file in the root directory (based on `.env.example`):

```env
# Frontend Google OAuth
VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"

# Netlify Serverless Backend Google Sheets Integration
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_SHEETS_ID="your-google-spreadsheet-id"
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

---

## 7. Netlify Deployment

1. Connect your repository to Netlify.
2. Netlify will automatically detect configuration from `netlify.toml`:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Functions Directory: `netlify/functions`
3. Add environment variables in Netlify site settings.
4. Deploy site. SPA routing for deep URLs (`/projects/123`, `/dashboard`, `/profile`) is handled automatically via `netlify.toml` redirects.

---

## 8. Definition of Done Checklist

- [x] React application runs locally with Vite.
- [x] TypeScript builds strictly without errors (`npm run lint`).
- [x] Tailwind CSS styling applied (0 inline CSS, 0 emojis).
- [x] All 10 screens/routes fully implemented and functional.
- [x] Responsive layout tested for 320px, 375px, 768px, 1024px, 1440px+.
- [x] Google authentication structure & developer mock flow ready.
- [x] Netlify Serverless Functions layer created.
- [x] Google Sheets API integration isolated behind backend function.
- [x] README and deployment instructions documented.
