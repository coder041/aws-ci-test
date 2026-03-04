# aws-ci-test

Backend (FastAPI + PostgreSQL + JWT auth) and frontend (React) with AWS CI/CD (Terraform, ECS, ALB) and staging/prod branches.

## Stack

- **Backend:** Python 3.12, FastAPI, SQLAlchemy, PostgreSQL (psycopg), JWT (python-jose), bcrypt (passlib), Alembic
- **Frontend:** React 18, Vite, React Router
- **Infra:** Terraform (ECR, ECS Fargate, ALB), GitHub Actions (deploy on `main` and `staging`)

## Auth (principal-grade)

- **Register:** `POST /auth/register` — `{"username":"...", "password":"..."}` (min 8 chars, username alphanumeric + _ -)
- **Login:** `POST /auth/login` — same body → `{"access_token":"<jwt>", "token_type":"bearer"}`
- **Me:** `GET /auth/me` — header `Authorization: Bearer <token>` → `{"id":1, "username":"..."}`
- Passwords are hashed with bcrypt; never stored or returned in plain text.

## Local development

### 1. PostgreSQL

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: DATABASE_URL, SECRET_KEY
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Run from **repo root** so `backend` and `alembic` resolve:

```bash
# from repo root
pip install -r backend/requirements.txt
cd backend && alembic upgrade head
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 — landing page, **Register** / **Log in**, then **Dashboard**.  
Vite proxies `/api` and `/auth` to the backend when `VITE_API_URL` is unset.

### 4. Frontend against a remote API

Create `frontend/.env`:

```
VITE_API_URL=http://your-alb-dns-or-api-host
```

Then `npm run build` and deploy the `dist/` folder (e.g. S3 + CloudFront).

## Environment (backend)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL URL, e.g. `postgresql+psycopg://user:pass@host:5432/dbname` |
| `SECRET_KEY` | JWT signing key (use a long random string in production) |
| `CORS_ORIGINS` | Comma-separated origins or `*` for dev |
| `DEBUG` | Set to true to enable SQL echo |

## Infra and CI/CD

- **Terraform:** `infra/` — workspaces `default` (prod) and `staging`. See `infra/README.md`.
- **GitHub Actions:** `deploy-dev.yml` (main → prod), `deploy-staging.yml` (staging → staging). Set repo variables for ECR, ECS cluster, ECS service per environment.
- **Two URLs:** Production and staging ALB URLs from Terraform outputs; no AWS console needed after apply.
