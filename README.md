# Expense Tracker

A full-stack expense tracking application.

## Project Structure

```
Expense_Tracker/
├── backend/          # Spring Boot REST API (Java 21, PostgreSQL)
│   ├── src/
│   ├── pom.xml
│   └── mvnw
└── frontend/         # React + Vite frontend (TailwindCSS)
    ├── src/
    │   ├── Components/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## Getting Started

### Backend
```bash
cd backend
./mvnw spring-boot:run        # starts on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev                   # starts on http://localhost:5173
```

## OAuth2 Login

- Google: `http://localhost:8080/oauth2/authorization/google`
- GitHub: `http://localhost:8080/oauth2/authorization/github`

After OAuth2 login, you'll be redirected to `http://localhost:5173/oauth2/redirect?token=<JWT>`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register with email/password |
| POST | `/auth/login` | Login → returns JWT |
| GET | `/auth/me` | Get current user profile |
| GET | `/oauth2/authorization/google` | Start Google OAuth2 |
| GET | `/oauth2/authorization/github` | Start GitHub OAuth2 |
