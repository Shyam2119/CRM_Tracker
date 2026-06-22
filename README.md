# Mini CRM Opportunity Tracker

A secure full-stack MERN application for managing a shared sales opportunity pipeline.  
Built for the **CEO Factory Full Stack Developer** assignment.

---

## Submission Links (fill before submitting)

| Item | URL |
|------|-----|
| **Live Frontend** | `https://your-app.vercel.app` |
| **Live Backend API** | `https://your-api.onrender.com` |
| **GitHub Repository** | `https://github.com/your-username/crm-opportunity-tracker` |

### Test Credentials (for evaluator)

```
Email:    demo@example.com
Password: Demo@1234
```

> Register this account on your deployed app before submitting, or use any account you create.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6, Tailwind CSS 4, Axios, React Router 6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (2h expiry) + bcrypt (12 rounds) |
| Validation | express-validator |
| DevOps | Docker, Docker Compose, Render blueprint |

---

## Features

### Required (Assignment Spec)
- JWT authentication with bcrypt password hashing
- Register / Login with validation and proper HTTP status codes
- Create opportunities — owner set from JWT (never from frontend body)
- Shared pipeline — all authenticated users see all opportunities
- Ownership-based edit & delete (enforced on backend)
- Pages: Login, Register, Dashboard, Create Opportunity, Edit Opportunity
- Stage & priority filters
- Cards showing all required fields + "your opportunity" indicator
- Loading, success, and error states
- Responsive UI (desktop + mobile)

### Bonus Enhancements
- Search, sorting, and pagination
- Table view and Kanban board view
- Dashboard summary cards (pipeline value, won value, high-priority)
- Activity & follow-up history per opportunity
- Centralized logging (`utils/logger.js`)
- API tests — auth + ownership validation (`npm test`)
- Docker setup

---

## Quick Start (Local)

### Prerequisites
- Node.js 18+ (20 recommended)
- MongoDB Atlas cluster (or local MongoDB)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI and a strong JWT_SECRET
npm run dev
```

Runs at **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs at **http://localhost:5173**

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Example | Required |
|----------|---------|----------|
| `PORT` | `5000` | No |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.../crm_opportunity_tracker` | Yes |
| `JWT_SECRET` | long random string | Yes |
| `JWT_EXPIRES_IN` | `2h` | No |
| `CLIENT_URL` | `http://localhost:5173` | Yes (set to deployed frontend URL in production) |
| `NODE_ENV` | `development` | No |

### Frontend (`frontend/.env`)

| Variable | Example | Required |
|----------|---------|----------|
| `VITE_API_URL` | `http://localhost:5000/api` | Yes |

> **Never commit `.env` files.** Only `.env.example` is tracked in Git.

---

## API Reference

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Bearer token | Current user profile |

### Opportunities

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/opportunities` | Authenticated | List (paginated) |
| GET | `/api/opportunities/summary` | Authenticated | Dashboard stats |
| GET | `/api/opportunities/:id` | Authenticated | Single opportunity |
| POST | `/api/opportunities` | Authenticated | Create |
| PUT | `/api/opportunities/:id` | Owner only | Update |
| DELETE | `/api/opportunities/:id` | Owner only | Delete |

**Auth header:** `Authorization: Bearer <token>`

**Query params (GET /api/opportunities):**

| Param | Values |
|-------|--------|
| `stage` | New, Contacted, Qualified, Proposal Sent, Won, Lost |
| `priority` | Low, Medium, High |
| `search` | Free text (customer, requirement, contact) |
| `sort` | `newest`, `value`, `priority`, `followUp` |
| `page` | Page number (default: 1) |
| `limit` | Items per page (default: 12, max: 50) |

**Health check:** `GET /api/health`

---

## Deployment Guide

### Step 1 — MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Database Access → create user
3. Network Access → add `0.0.0.0/0`
4. Connect → Drivers → copy connection string
5. Add `/crm_opportunity_tracker` before `?` in the URI

### Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "Mini CRM Opportunity Tracker - CEO Factory assignment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/crm-opportunity-tracker.git
git push -u origin main
```

### Step 3 — Deploy Backend (Render)

1. [render.com](https://render.com) → New Web Service → connect GitHub repo
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Environment Variables:**
   - `MONGODB_URI` = your Atlas URI
   - `JWT_SECRET` = long random string
   - `JWT_EXPIRES_IN` = `2h`
   - `CLIENT_URL` = your Vercel frontend URL (set after step 4)
   - `NODE_ENV` = `production`
6. Deploy → copy URL (e.g. `https://crm-api.onrender.com`)

### Step 4 — Deploy Frontend (Vercel)

1. [vercel.com](https://vercel.com) → New Project → import GitHub repo
2. **Root Directory:** `frontend`
3. **Framework:** Vite
4. **Environment Variable:**
   - `VITE_API_URL` = `https://crm-api.onrender.com/api`
5. Deploy → copy URL (e.g. `https://crm-tracker.vercel.app`)

### Step 5 — Finalize CORS

Go back to Render → set `CLIENT_URL` = your Vercel URL → redeploy backend.

### Step 6 — Update README

Fill in the submission links and test credentials at the top of this file.

---

## Running Tests

```bash
cd backend
npm install
# Ensure .env has a valid MONGODB_URI
npm test
```

Tests cover: registration, duplicate email, login, invalid credentials, opportunity CRUD, and ownership authorization (403 for non-owners).

---

## Docker (Optional)

```bash
# Ensure backend/.env is configured
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Project Structure

```
CRM_Assignment/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/logger.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/api.test.js
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── Dockerfile
│   ├── vercel.json
│   └── .env.example
├── docker-compose.yml
├── render.yaml
└── README.md
```

---

## Pre-Submission Checklist

- [ ] App deployed and live URL works
- [ ] GitHub repo is public (or shared with evaluator)
- [ ] README updated with live links and test credentials
- [ ] `.env` files are NOT in the repository
- [ ] Registration and login work on deployed app
- [ ] Create / view / edit / delete opportunities work
- [ ] Non-owner cannot edit or delete others' opportunities
- [ ] MongoDB Atlas connected to deployed backend

---

## Known Limitations

- No email verification or password reset
- Kanban uses dropdown for stage change (no drag-and-drop)
- Activity history is append-only

---

## Security Notes

- Passwords hashed with bcrypt (12 salt rounds)
- JWT identity extracted in middleware — `owner`/`user_id` never accepted from frontend
- Ownership validated server-side on every update/delete
- All opportunity routes require authentication
- Secrets stored in environment variables only

---

## Author

Built as part of the CEO Factory MERN Stack Developer assignment.
