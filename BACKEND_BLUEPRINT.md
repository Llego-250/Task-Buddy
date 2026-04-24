# Task Buddy Backend Blueprint

This document defines how the backend for Task Buddy should be designed based on the current frontend implementation.

## 1) Current Frontend Scope (What Backend Must Support)

- Authentication:
  - Register, login, logout
  - Route protection (`/dashboard`, `/tasks`, `/settings`)
- Tasks:
  - Create, edit, delete task
  - Move task between columns (`todo`, `inprogress`, `inreview`, `done`)
  - Search/filter by title/description/priority/category
  - Task preview (description/details)
- Dashboard:
  - Summary metrics, status distribution, priority distribution, activity/workload sections
- Settings:
  - Dark mode preference
  - Clear all tasks

## 2) Data Model (Entities)

## User
- `id` (uuid, PK)
- `name` (string)
- `email` (string, unique, lowercase)
- `password_hash` (string)
- `created_at`, `updated_at`, `last_login_at`

## Task
- `id` (uuid, PK)
- `owner_user_id` (uuid, FK -> users.id)
- `title` (string)
- `description` (text, nullable)
- `status` (enum: `todo | inprogress | inreview | done`)
- `priority` (enum: `High | Medium | Low`)
- `category` (enum/string)
- `due_date` (date, nullable)
- `image_url` (string, nullable)
- `channel_name` (string, nullable)
- `channel_icon` (string, nullable)
- `created_at`, `updated_at`

## UserSettings
- `user_id` (uuid, PK/FK -> users.id)
- `dark_mode` (boolean, default false)
- `default_view` (enum: `table | list | kanban`, nullable)
- `updated_at`

## Optional (Recommended for analytics/history)
## TaskActivity
- `id` (uuid, PK)
- `task_id` (uuid, FK -> tasks.id)
- `user_id` (uuid, FK -> users.id)
- `action` (enum: `created | updated | moved | deleted`)
- `from_status` (nullable)
- `to_status` (nullable)
- `created_at`

## 3) API Design (REST)

## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

## User/Profile
- `GET /api/users/me`
- `PATCH /api/users/me`
- `PATCH /api/users/me/password`

## Tasks
- `GET /api/tasks?status=&priority=&category=&search=&page=&limit=`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status` (for drag-and-drop)
- `DELETE /api/tasks` (clear all tasks for current user)

## Dashboard
- `GET /api/dashboard/summary`
- `GET /api/dashboard/priority-distribution`
- `GET /api/dashboard/status-distribution`
- `GET /api/dashboard/activity-heatmap`
- `GET /api/dashboard/workload`

## Settings
- `GET /api/settings`
- `PATCH /api/settings`

## 4) Auth & Security Recommendation

- Use JWT access token (short-lived) + refresh token (rotating, httpOnly secure cookie).
- Password hashing with Argon2id (preferred) or bcrypt.
- Never store plaintext passwords.
- Validate and normalize emails to lowercase.
- Add rate limiting on auth endpoints.
- Add input validation and ownership checks on all task endpoints.

## 5) Suggested Tech Stack

- **Backend:** SpringBoot
- **DB:** MongoDB
- **ORM:** Prisma
- **Auth:** JWT + refresh sessions table
- **Validation:** Zod or Joi
- **Testing:** Vitest/Jest + Supertest

## 6) Frontend Integration Notes

Current app stores auth/tasks in `localStorage`. Migration plan:

1. Replace localStorage auth in `authStore` with API calls + `GET /auth/me` bootstrap.
2. Replace localStorage tasks in `taskStore` with API-backed actions:
   - `fetchTasks`, `createTask`, `updateTask`, `moveTask`, `deleteTask`, `clearTasks`
3. Keep current UI behavior; only swap data source to backend.
4. Load dashboard cards from dashboard endpoints instead of static/mocked values.

## 7) Rollout Plan

## Phase 1 (MVP)
- Auth endpoints + secure sessions
- Task CRUD + move status endpoint
- User settings endpoint (dark mode)

## Phase 2
- Dashboard aggregate endpoints
- Task activity logging
- Better filtering/pagination

## Phase 3
- Hardening (audit logs, rate limits, tests, monitoring)
- Optional multi-workspace/team support

---

If you want, I can next generate:
- an `OPENAPI.md` (full request/response contracts), or
- a starter backend folder structure (`server/`) with Express + Prisma + auth/task modules.
