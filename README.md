# Scribbl Team Setup Monorepo

Production-ready fullstack starter with:
- Backend: Node.js + Express + Socket.IO
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Optional Redis integration and Docker Compose setup

## Project Structure

- backend
  - src
    - config
    - sockets
    - rooms
    - utils
    - server.js
- frontend
  - src
    - pages
    - services
    - store
    - components
- docker-compose.yml
- package.json

## Prerequisites

- Node.js 20+
- npm 10+
- Docker and Docker Compose (optional)

## Install

From repo root:

npm install

## Environment Setup

Backend env file at backend/.env:

PORT=4000
FRONTEND_URL=http://localhost:5173
REDIS_URL=

Frontend env file at frontend/.env:

VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000

You can copy templates:

- backend/.env.example -> backend/.env
- frontend/.env.example -> frontend/.env

## Run Commands

From root folder:

- start-dev: run frontend and backend together
  - npm run start-dev
- dev: same as start-dev
  - npm run dev
- build: build frontend app
  - npm run build
- start-prod: build frontend then start backend (backend serves frontend dist)
  - npm run start-prod
- seed: generate sample data file
  - npm run seed
- lint: run backend and frontend linting
  - npm run lint

## Backend Details

Scripts:
- dev: nodemon src/server.js
- start: node src/server.js
- lint

Endpoints:
- GET /health
- GET /

Socket events:
- room:create
- room:join
- lobby:update
- disconnect handling

CORS and Socket.IO origin are configured from FRONTEND_URL.

## Frontend Details

Scripts:
- dev
- build
- preview
- lint

Pages:
- Login
- Join Room
- Lobby
- Dashboard
- NotFound

Service layer included:
- API helper for backend requests
- Socket client setup for room events
- Zustand store for user, room, game state
- Error boundary

## Example End-to-End Flow

1. Open frontend and enter player name on Login.
2. Create room or join room code on Join Room page.
3. Lobby updates in real-time via lobby:update socket event.
4. Dashboard fetches GET /health to verify API connectivity.

## Docker (Optional)

Run all services:

docker compose up --build

Services:
- backend on 4000
- frontend on 4173
- redis on 6379

Note: for containerized frontend-to-backend communication, adjust frontend env values if needed.

## Deployment Notes

- Use npm run build for frontend assets.
- Use npm run start in backend to serve API and static frontend build.
- Set production FRONTEND_URL and VITE_* variables per deployment domain.
- Redis is optional; leave REDIS_URL empty to disable.

## What To Ask AI To Add Next

Use prompts like:

- Add JWT auth and protected socket rooms.
- Add room host controls (kick, lock room, start game).
- Add Redis adapter for Socket.IO horizontal scaling.
- Add PostgreSQL with Prisma for persistent users and game history.
- Add test coverage with Vitest (frontend) and Jest/Supertest (backend).
- Add CI pipeline for lint, build, and tests.
- Add monitoring (health dashboards, structured logs, tracing).
