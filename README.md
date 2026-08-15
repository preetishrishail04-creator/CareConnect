# CareConnect — Remote Family-Care Platform

> **Tagline**: *"Be there, even when you can't be there."*

CareConnect is a full-stack, production-quality remote family-care platform engineered for people who live away from their elderly parents (e.g., a daughter working in Bangalore whose elderly parents live in another city). CareConnect enables families to remotely coordinate everyday care routines, monitor daily well-being, schedule appointments, track medications, request verified caregiver assistance, and receive real-time emergency alerts.

---

## ⚠️ Mandatory Safety Disclaimer

**CareConnect is a care coordination and communication platform, NOT a medical diagnosis or treatment application.**
CareConnect does NOT provide medical diagnoses, prescriptions, or emergency medical treatment. In case of a life-threatening medical emergency, users should immediately call local medical emergency services (e.g. 112 / 102) or visit the nearest hospital.

---

## 🌟 Key Features

1. **💊 Medicine Reminders & Compliance**
   - Family members set schedules, dosages, and meal advice.
   - Elderly parents log compliance with high-contrast "Taken" or "Remind later" buttons.
   - Real-time logging (TAKEN, MISSED, SKIPPED) and family history timeline.

2. **🏥 Appointment Management**
   - Schedule doctor visits, hospital/clinic departments, appointment times, purpose, and prep notes.
   - Timely reminders sent to parents and family members.

3. **❤️ Daily Well-Being Check-Ins**
   - Simple 1-tap parent mood check-in (😊 Good, 😐 Okay, 😟 Not feeling well, 😔 Need help).
   - Selecting "Need help" automatically triggers an urgent notification to all connected family members.

4. **👨‍👩‍👧 Family Connection & Permission Control**
   - Consent-based family invitation workflow (Accept / Reject).
   - Granular permission levels: `FULL_ACCESS`, `LIMITED_ACCESS`, `VIEW_ONLY`.

5. **🤝 Caregiver Marketplace & Visit Lifecycle**
   - Admin-verified caregiver profiles (skills, experience, location, rating, completed visits count).
   - Non-medical visit requests (Hospital accompaniment, grocery pick-up, home safety check-ins).
   - Real-time visit tracking (`ACCEPTED` ➔ `ON THE WAY` ➔ `ARRIVED` ➔ `COMPLETED`).

6. **🆘 Emergency Alert System**
   - Prominent, accessible 🆘 EMERGENCY button with explicit confirmation dialog.
   - Optional GPS location attachment and quick-dial links to local emergency services and designated contacts.
   - Real-time status lifecycle for family (`ACTIVE` ➔ `ACKNOWLEDGED` ➔ `RESOLVED`).

7. **🔔 In-App Notification Center**
   - Real-time alerts for medicine compliance, missed doses, check-ins, caregiver updates, and emergency alerts.
   - Actions: Mark as read, mark all read, delete notifications.

8. **📋 Activity Timeline**
   - Complete chronological audit log of all care events and actions per parent.

9. **🛡️ Admin Governance & Control Panel**
   - Analytics dashboard with platform statistics and user breakdown.
   - Caregiver verification approval/rejection workflow.
   - Account suspension & status management.

---

## 👥 User Roles & Permissions

| Role | Description | Core Capabilities |
| :--- | :--- | :--- |
| `FAMILY_MEMBER` | Daughter, Son, or Family Member | Connect parents, manage medicines/appointments, request caregivers, add emergency contacts, view activity timeline & status. |
| `PARENT` | Elderly Parent (Elderly-Friendly UI) | High-contrast, large-button interface to mark medicines taken, record daily check-ins, call contacts, and trigger emergency alerts. |
| `CAREGIVER` | Care Assistant | Manage caregiver profile, browse open care visit requests, accept requests, update visit progress status. |
| `ADMIN` | Platform Administrator | View analytics, verify caregiver profiles, manage user accounts, suspend suspicious users, monitor emergency logs. |

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access / Profile |
| :--- | :--- | :--- | :--- |
| **Family Member** | `preeti@example.com` | `Password123!` | Connected to Lakshmi Sharma (Full Access) |
| **Parent** | `lakshmi@example.com` | `Password123!` | Elderly-Friendly Senior Dashboard |
| **Caregiver** | `ravi@example.com` | `Password123!` | Verified Caregiver (3 Yrs Exp, 4.8 ⭐) |
| **Admin** | `admin@example.com` | `Password123!` | Full Platform Governance Panel |

---

## 🏗️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Context API.
- **Backend**: Node.js, Express.js (TypeScript), REST APIs, CORS, bcrypt, JWT access & refresh tokens.
- **Database**: SQLite (via Prisma ORM) for zero-config local execution, switchable to MySQL/PostgreSQL for production.
- **Security**: Password hashing with bcrypt, JWT authorization middleware, strict RBAC, data ownership checks.

---

## 📁 Repository Structure

```text
careconnect/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database models & enums
│   │   └── seed.ts             # Demo seed data
│   ├── src/
│   │   ├── controllers/        # REST API Controllers
│   │   ├── middleware/         # Auth & RBAC Middleware
│   │   ├── routes/             # Express API Routes
│   │   ├── utils/              # JWT & Prisma helpers
│   │   ├── app.ts              # Express App setup
│   │   └── server.ts           # HTTP Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # Accessible UI & Modal components
│   │   ├── context/            # AuthContext API state
│   │   └── lib/                # API client with token interceptors
│   ├── package.json
│   └── tailwind.config.ts
├── docs/                       # Project Documentation
└── README.md
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js (v18+) & npm

### 1. Backend Setup & Database Seeding

```bash
cd backend
npm install

# Push database schema & run seed script
npx prisma db push
npm run prisma:seed

# Start backend server in development mode
npm run dev
```
*Backend runs at `http://localhost:5000`*

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start Next.js dev server
npm run dev
```
*Frontend runs at `http://localhost:3000`*

---

## 📡 REST API Documentation

### Auth Endpoints
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login with credentials & receive JWT tokens
- `POST /api/auth/refresh` — Refresh access token using refresh token
- `POST /api/auth/logout` — Logout user
- `GET /api/auth/me` — Fetch authenticated user profile

### Family Connections
- `POST /api/family/invite` — Invite parent by email (`FAMILY_MEMBER`)
- `POST /api/family/respond` — Accept/reject family connection (`PARENT`)
- `GET /api/family/connections` — Get active family connections

### Parent Data & Care Features
- `GET /api/parents` — List connected parent profiles
- `GET /api/parents/:id` — Get detailed parent profile
- `GET /api/medications` — Get parent medications
- `POST /api/medications` — Create medication reminder
- `POST /api/medications/:id/taken` — Mark medication status (`TAKEN`, `SKIPPED`, `MISSED`)
- `GET /api/appointments` — Get appointments
- `POST /api/appointments` — Schedule doctor appointment
- `POST /api/checkins` — Submit daily check-in (`GOOD`, `OKAY`, `NOT_GOOD`, `NEED_HELP`)
- `GET /api/care/caregivers` — List caregiver profiles
- `POST /api/care/care-requests` — Create care visit request
- `POST /api/care/care-requests/:id/accept` — Caregiver accepts request
- `PUT /api/care/care-visits/:id/status` — Update visit status (`ON_THE_WAY`, `ARRIVED`, `COMPLETED`)
- `POST /api/emergency` — Trigger emergency alert
- `PUT /api/emergency/:id/acknowledge` — Acknowledge emergency alert
- `PUT /api/emergency/:id/resolve` — Resolve emergency alert
- `GET /api/notifications` — Get in-app notifications
- `GET /api/activities` — Get family activity timeline

---

## 🚀 Deployment Instructions

- **Frontend (Vercel)**: Push `frontend/` directory to GitHub, import into Vercel, set `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`.
- **Backend (Render)**: Deploy `backend/` directory on Render as a Web Service, set `DATABASE_URL` and `JWT_ACCESS_SECRET`.
- **Database (Aiven / MySQL)**: Update `provider = "mysql"` in `schema.prisma` and run `npx prisma db push`.
