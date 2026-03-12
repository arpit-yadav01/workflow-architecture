# Workflow Orchestration Engine

A mini workflow orchestration system similar to Apache Airflow / GitHub Actions.
Users can create workflows as DAG pipelines, execute them, retry failed steps, and monitor runs in real time.

This project was built for the **Distributed Workflow Orchestration Engine assignment**.

---

## Features

* User authentication with JWT (stored in cookies)
* Workflow builder using React Flow
* DAG validation (cycle detection)
* Parallel step execution
* Retry with exponential backoff
* Timeout handling
* Failure modes (stop / continue / skip)
* Workflow run history
* Step logs and outputs
* Cancel running workflow
* Server-Sent Events for live updates
* Run monitor UI

---

## Tech Stack

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* Cookie-parser
* EventEmitter (SSE)
* Axios

### Frontend

* React (Vite)
* React Flow
* TailwindCSS
* Axios
* React Router

---
Backend - npm install 
            npm run dev

frontend - npm install 
        - npm run dev            
## Project Structure

```
workflow-engine
│
├── backend
│   ├── models
│   ├── controllers
│   ├── routes
│   ├── engine
│   ├── services
│   ├── middleware
│   ├── utils
│   ├── config
│   └── server.js
│
└── frontend
    ├── pages
    ├── context
    ├── api
    └── components
```

---

## Setup Instructions

### 1. Clone project

```
git clone <repo>
cd workflow-engine
```

---

### 2. Backend setup

```
cd backend
npm install
```

Create `.env`

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/workflow_engine
JWT_SECRET=secret123
```

Run backend

```
npm run dev
```

---

### 3. Frontend setup

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

Backend runs at:

```
http://localhost:5000
```

---

## Test User

You can login using:

```
email: test@test.com
password: 123456
```

If user does not exist, register first.

---

## API Endpoints

### Auth

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

---

### Workflows

```
POST /api/workflows
GET /api/workflows
GET /api/workflows/:id
PUT /api/workflows/:id
DELETE /api/workflows/:id
```

---

### Runs

```
POST /api/runs/:id/trigger
POST /api/runs/:id/cancel

GET /api/runs
GET /api/runs/:id
GET /api/runs/:id/steps/:stepId
GET /api/runs/:id/stream
```

---

## Step Types

Supported step types:

* http
* delay
* transform
* condition

Example step:

```
{
  stepId: "1",
  type: "delay",
  dependsOn: [],
  config: { delayMs: 1000 }
}
```

---

## Execution Engine

Features:

* Topological sort
* Cycle detection
* Parallel execution
* Shared context
* Retry logic
* Timeout
* Failure modes
* StepRun tracking
* WorkflowRun tracking

---

## Failure Modes

```
stop
continue
skip
```

---

## Retry Logic

```
delay = backoffMs * 2^(attempt-1)
```

---

## Live Updates

Uses Server-Sent Events

```
GET /api/runs/:id/stream
```

Frontend receives live step status.

---

## Builder UI

* Drag nodes
* Connect edges
* Configure step
* Save workflow
* Run workflow

---

## Run Monitor

* Live node colors
* Logs
* Outputs
* Retry info
* Duration

---

## Cancel Run

```
POST /api/runs/:id/cancel
```

Stops execution gracefully.

---

## Future Improvements

* Queue system
* Worker threads
* Better UI config panel
* Step templates
* Export / import workflows
* WebSocket instead of SSE

---


