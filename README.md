# 💰 Full-Stack Expense Tracker (Finance OS)

A modern full-stack personal finance and expense tracking platform built with **Spring Boot**, **PostgreSQL**, **React 19**, **Tailwind CSS v4**, and **Docker**.

---

## 🏗️ Architecture & Monorepo Layout

```
Expense_Tracker/
├── Backend/                 # Spring Boot 4 REST API (Java 17/21, PostgreSQL, JJWT)
│   ├── src/
│   ├── Dockerfile          # Multi-stage Alpine JRE build
│   └── pom.xml
├── frontend/                # React 19 + Vite + Tailwind v4 + Nginx
│   ├── src/
│   │   ├── Components/     # Home, Analytics, Savings, Navbar, Login, etc.
│   │   ├── App.jsx
│   │   └── index.css
│   ├── nginx.conf          # Reverse proxy + SPA routing + gzip
│   └── Dockerfile          # Multi-stage Node build & Nginx production server
├── docker-compose.yml       # Orchestrates Postgres, Backend & Frontend
├── .env.example             # Template for secrets and credentials
└── README.md
```

---

## 🐳 Quick Start with Docker (Recommended)

Run the entire application (Database + Backend + Frontend) in one command:

```bash
# 1. Clone the repository
git clone https://github.com/Prafull099/Expense_Tracker.git
cd Expense_Tracker

# 2. Configure environment variables (optional for local testing)
cp .env.example .env

# 3. Launch all containers
docker compose up --build -d
```

- 🌐 **Frontend Web App**: `http://localhost:5173`
- ⚙️ **Backend REST API**: `http://localhost:8080`
- 🐘 **PostgreSQL Database**: `localhost:5432`

To stop:
```bash
docker compose down
```

---

## 💻 Local Development (Without Docker)

### 1. Backend
```bash
cd Backend
./mvnw spring-boot:run        # Starts on http://localhost:8080
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                   # Starts on http://localhost:5173
```

---

## 🔐 OAuth2 & Security

- **Google OAuth2**: `http://localhost:8080/oauth2/authorization/google`
- **GitHub OAuth2**: `http://localhost:8080/oauth2/authorization/github`
- **Success Redirect**: `http://localhost:5173/oauth2/redirect?token=<JWT>`

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register new user with case-insensitive collision check |
| `POST` | `/auth/login` | Login with username/email & password → returns JWT |
| `GET` | `/auth/me` | Fetch authenticated user profile & roles |
| `GET` | `/oauth2/authorization/google` | Trigger Google OAuth2 flow |
| `GET` | `/oauth2/authorization/github` | Trigger GitHub OAuth2 flow |

