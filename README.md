# ⚡ AxioraAI

> **A production-style, full-stack multi-agent AI assistant powered by LangGraph, microservices, and modern cloud infrastructure.**

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-1C3C3C)](https://langchain-ai.github.io/langgraph/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Cache%20%2B%20Sessions-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![AWS ECS](https://img.shields.io/badge/AWS-ECS%20Fargate-FF9900?logo=amazonecs&logoColor=white)](https://aws.amazon.com/ecs/)
[![AWS ECR](https://img.shields.io/badge/AWS-ECR-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/ecr/)
[![CloudFront](https://img.shields.io/badge/AWS-CloudFront-8C4FFF?logo=amazonaws&logoColor=white)](https://aws.amazon.com/cloudfront/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Automated%20Pipeline-4CAF50?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ What is AxioraAI?

**AxioraAI** is a full-stack, ChatGPT-like AI platform built around a **⚙️ true microservices backend** and a **LangGraph multi-agent system** — every service (Gateway, Auth, Chat, Billing, Agent) is an independently deployable unit with its own container, its own scaling behavior, and its own lifecycle, rather than a single monolithic API.

Instead of sending every prompt to the same model, AxioraAI intelligently routes each request to a specialized agent:

```text
💬 Chat       🔎 Web Search       💻 Coding
📄 PDF        📊 PowerPoint       📚 PDF-RAG
👁️ Vision     🎨 Image Generation
```

It also includes:

- 🔐 Firebase authentication + Redis-backed sessions
- 💳 Razorpay subscriptions and credit-based usage
- 🧠 Redis conversation memory
- 📚 Qdrant-powered PDF RAG
- ☁️ AWS S3 artifact storage
- 🐳 Dockerized backend services
- ⚡ React + Redux frontend
- 🛡️ Gateway-based authentication and service routing
- ⚙️ **Microservices deployed independently on AWS ECS (Fargate)**
- 📦 Docker images built and pushed to **AWS ECR**
- 🌐 **Application Load Balancer** fronting the ECS services, exposing a live backend URL
- ☁️ Frontend served globally through **AWS CloudFront**
- 🔁 **CI/CD pipeline** automating build → push → deploy on every release

> **The goal:** demonstrate how a real AI SaaS product can be designed *and shipped* beyond a single chatbot endpoint — from local development all the way to a live, load-balanced, microservices deployment on AWS.

---

## 🎯 Core Features

| Feature | What it does |
|---|---|
| 🤖 **Multi-Agent Routing** | LangGraph decides which specialized agent should process a request |
| 💬 **AI Chat** | General conversation with Redis-backed recent-message memory |
| 🔎 **Web Search** | Tavily retrieves live web information before the chat agent composes the answer |
| 💻 **Code Generation** | Generates/reviews/debugs code and can return structured project artifacts |
| 📄 **PDF Generation** | Generates real PDF documents and stores them in S3 |
| 📊 **PPT Generation** | Generates PowerPoint decks using `pptxgenjs` |
| 📚 **PDF-RAG** | Upload a PDF, embed it into Qdrant, and ask grounded questions |
| 👁️ **Image Analysis** | Gemini multimodal vision for OCR, charts, tables and image Q&A |
| 🎨 **AI Image Generation** | Prompt engineering + Pollinations AI + S3 |
| 🔐 **Authentication** | Firebase login with Redis session cookies |
| 💳 **Billing** | Razorpay plans with credit-based usage |
| 📦 **Artifacts** | Monaco-powered viewer for generated code artifacts |
| ☁️ **Cloud Storage** | Presigned S3 URLs for generated files |

---

# 🏗️ Architecture

The application follows a **gateway → microservices → AI/data infrastructure** architecture.

```mermaid
flowchart TB
    U["👤 User"]

    FE["⚛️ React + Vite Frontend<br/>Redux • Tailwind • Axios"]

    ALB["🌐 Load Balancer / Entry Point"]
    GW["🚪 API Gateway<br/>Express<br/>Session Middleware"]

    AUTH["🔐 Auth Service<br/>Firebase • Sessions"]
    CHAT["💬 Chat Service<br/>Conversations • Messages"]
    BILL["💳 Billing Service<br/>Razorpay • Plans"]
    AGENT["🧠 Agent Service<br/>LangGraph StateGraph"]

    ROUTER["🎯 Intelligent Router"]

    CHATAG["💬 Chat Agent"]
    SEARCH["🔎 Search Agent"]
    CODE["💻 Coding Agent"]
    PDF["📄 PDF Agent"]
    PPT["📊 PPT Agent"]
    RAG["📚 PDF-RAG Agent"]
    VISION["👁️ Image Analyzer"]
    IMG["🎨 Image Generation"]

    MONGO[("🍃 MongoDB")]
    REDIS[("⚡ Redis")]
    QDRANT[("🔷 Qdrant")]
    S3[("☁️ AWS S3")]

    LLM["🤖 LLM Providers<br/>Groq • Gemini • OpenRouter"]
    TAVILY["🔎 Tavily"]
    RAZOR["💳 Razorpay"]
    FIREBASE["🔥 Firebase"]

    U --> FE
    FE --> ALB
    ALB --> GW

    GW --> AUTH
    GW --> CHAT
    GW --> BILL
    GW --> AGENT

    AUTH --> FIREBASE
    AUTH --> MONGO
    AUTH --> REDIS

    CHAT --> MONGO
    CHAT --> REDIS

    BILL --> RAZOR
    BILL --> MONGO
    BILL --> AUTH

    AGENT --> ROUTER

    ROUTER --> CHATAG
    ROUTER --> SEARCH
    ROUTER --> CODE
    ROUTER --> PDF
    ROUTER --> PPT
    ROUTER --> RAG
    ROUTER --> VISION
    ROUTER --> IMG

    SEARCH --> TAVILY
    SEARCH --> CHATAG

    CHATAG --> LLM
    CODE --> LLM
    PDF --> LLM
    PPT --> LLM
    VISION --> LLM
    IMG --> LLM

    RAG --> QDRANT
    RAG --> LLM

    PDF --> S3
    PPT --> S3
    IMG --> S3
```

### 🔄 Request lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Frontend
    participant Gateway
    participant Agent as Agent Service
    participant Router
    participant AI as Specialized Agent
    participant Data as MongoDB / Redis / Qdrant
    participant S3 as AWS S3

    User->>Frontend: Enter prompt / upload file
    Frontend->>Gateway: POST /api/agent
    Gateway->>Gateway: Validate Redis session
    Gateway->>Agent: Forward request + x-user-id
    Agent->>Router: Classify request

    alt PDF uploaded
        Router->>AI: PDF-RAG Agent
        AI->>Data: Retrieve relevant chunks
    else Image uploaded
        Router->>AI: Image Analyzer
    else Normal prompt
        Router->>AI: chat / search / coding / pdf / ppt / vision
    end

    AI->>Agent: Generate response / artifact

    opt Generated PDF/PPT/Image
        Agent->>S3: Upload artifact
        S3-->>Agent: Presigned URL
    end

    Agent-->>Gateway: Response
    Gateway-->>Frontend: AI response
    Frontend-->>User: Render answer / artifact
```

---

# ☁️ Cloud Deployment Architecture (AWS)

AxioraAI isn't just designed as microservices — it is **deployed** as microservices. Each backend service is containerized, pushed to a private registry, and run as its own independently scalable service behind a load balancer, while the frontend is distributed globally through a CDN.

> ⚙️ **Highlight — Microservices in production:** the Gateway, Auth, Chat, Billing and Agent services each ship as a **separate Docker image → separate ECR repository → separate ECS service**, so any one service can be redeployed, scaled, or rolled back without touching the others.

### 🔄 Deployment pipeline

```mermaid
flowchart LR
    DEV["👨‍💻 Developer<br/>git push"]

    subgraph CICD["🔁 CI/CD Pipeline"]
        BUILD["🛠️ Build & Test"]
        IMG2["🐳 Build Docker Images<br/>(per microservice)"]
    end

    subgraph AWS["☁️ AWS"]
        ECR[("📦 Amazon ECR<br/>Image Repositories")]

        subgraph ECS["🧩 Amazon ECS Cluster"]
            direction TB
            S1["🚪 Gateway Task"]
            S2["🔐 Auth Task"]
            S3T["💬 Chat Task"]
            S4["💳 Billing Task"]
            S5["🧠 Agent Task"]
        end

        ALB2["⚖️ Application Load Balancer"]
        URL["🔗 Backend URL"]

        S3B[("🪣 S3 — Frontend Build")]
        CF["🌐 CloudFront CDN"]
    end

    USER["🧑‍💻 End User"]

    DEV --> BUILD --> IMG2 --> ECR
    ECR -->|"pull image"| S1
    ECR -->|"pull image"| S2
    ECR -->|"pull image"| S3T
    ECR -->|"pull image"| S4
    ECR -->|"pull image"| S5

    ALB2 --> S1
    ALB2 --> S2
    ALB2 --> S3T
    ALB2 --> S4
    ALB2 --> S5
    ALB2 --> URL

    IMG2 -.->|"deploy static build"| S3B
    S3B --> CF

    USER -->|"HTTPS"| CF
    CF -->|"/api requests"| URL
    URL --> ALB2
```

### 🧭 What actually happens, step by step

| Stage | Action | Service |
|---|---|---|
| 1️⃣ | Code is pushed and the **CI/CD pipeline** triggers automatically | GitHub Actions / pipeline |
| 2️⃣ | Each microservice is **built into its own Docker image** | Gateway • Auth • Chat • Billing • Agent |
| 3️⃣ | Images are **pushed to Amazon ECR** (one repository per service) | 📦 AWS ECR |
| 4️⃣ | **Amazon ECS** pulls the latest images and runs each service as an independent task/service | 🧩 AWS ECS |
| 5️⃣ | An **Application Load Balancer** sits in front of the ECS services and exposes a single, stable **backend URL** | ⚖️ AWS ALB |
| 6️⃣ | The **React frontend build** is deployed and served through **CloudFront**, giving low-latency global delivery | ☁️ AWS CloudFront |
| 7️⃣ | The frontend on CloudFront talks to the backend URL behind the ALB, completing the request loop | 🔁 End-to-end |

### 🏆 Why this matters

- 🧩 **True service isolation** — every microservice has its own image, its own ECS service, and can scale or fail independently.
- ⚖️ **Load-balanced backend** — the ALB distributes traffic across running tasks and gives a single stable entry point for the API.
- 🌐 **Global, fast frontend** — CloudFront caches and serves the frontend close to the user, decoupled entirely from backend deployment.
- 🔁 **Automated releases** — the CI/CD pipeline removes manual build/push/deploy steps, so shipping a change is a `git push`, not a checklist.

---

# 🧠 The Multi-Agent Brain

The core differentiator is the **LangGraph `StateGraph`** inside:

```text
Backend/services/agent
```

The shared state is:

```js
{
  prompt,
  aiResponse,
  agent,
  conversationId,
  searchResults,
  images,
  artifacts,
  userId,
  file
}
```

The high-level graph is:

```mermaid
flowchart LR
    START(["🚀 START"]) --> R["🎯 Router"]

    R --> C["💬 Chat"]
    R --> S["🔎 Search"]
    R --> CO["💻 Coding"]
    R --> P["📄 PDF"]
    R --> PP["📊 PPT"]
    R --> PR["📚 PDF-RAG"]
    R --> V["👁️ Image Analyzer"]
    R --> I["🎨 Image Generation"]

    S --> C

    C --> END(["🏁 END"])
    CO --> END
    P --> END
    PP --> END
    PR --> END
    V --> END
    I --> END
```

### 🎯 Router decision process

```mermaid
flowchart TD
    A["Incoming Request"] --> B{"Agent explicitly selected?"}

    B -->|Yes| C["Use requested agent"]
    B -->|No| D{"File uploaded?"}

    D -->|PDF| E["📚 PDF-RAG"]
    D -->|Image| F["👁️ Image Analyzer"]
    D -->|No| G["🤖 Groq Classifier"]

    G --> H{"Intent"}

    H --> I["💬 Chat"]
    H --> J["🔎 Search"]
    H --> K["💻 Coding"]
    H --> L["📄 PDF"]
    H --> M["📊 PPT"]
    H --> N["🎨 Vision / Image Generation"]
```

### 🤖 Agent matrix

| Agent | Responsibility | Main Technology | Output |
|---|---|---|---|
| 💬 **Chat** | General conversation + memory | Groq | Markdown / text |
| 🔎 **Search** | Web search + answer composition | Tavily + Groq | Search-backed answer |
| 💻 **Coding** | Generate/review/debug/optimize code | OpenRouter / DeepSeek | Code artifact / Markdown |
| 📄 **PDF** | Generate downloadable PDF | LLM + pdfkit + S3 | PDF URL |
| 📊 **PPT** | Generate 6-slide presentation | LLM + pptxgenjs + S3 | PPTX URL |
| 📚 **PDF-RAG** | Ask questions over uploaded PDFs | Gemini + Qdrant | Grounded answer |
| 👁️ **Image Analyzer** | Analyze uploaded images | Gemini Vision | Markdown analysis |
| 🎨 **Vision / Image Gen** | Generate images from prompts | LLM + Pollinations + S3 | Image URL |

---

# 🔐 Authentication Flow

AxioraAI uses **Firebase Authentication** for identity and **Redis sessions** for application-level authentication.

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant FE as ⚛️ Frontend
    participant FB as 🔥 Firebase
    participant GW as 🚪 Gateway
    participant AUTH as 🔐 Auth Service
    participant R as ⚡ Redis
    participant DB as 🍃 MongoDB

    U->>FE: Sign in
    FE->>FB: Authenticate
    FB-->>FE: Firebase ID Token

    FE->>GW: POST /api/auth/login
    GW->>AUTH: Forward Firebase token
    AUTH->>FB: Verify token
    FB-->>AUTH: Valid identity

    AUTH->>DB: Upsert user
    AUTH->>R: Store session (7-day TTL)
    AUTH-->>GW: httpOnly session cookie
    GW-->>FE: Authenticated

    FE->>GW: Protected API request
    GW->>R: Validate session
    R-->>GW: User session
    GW->>AUTH: Forward x-user-id
```

---

# 💳 Billing & Credit System

AxioraAI uses **Razorpay** with usage-based credits.

### Plans

| Plan | Price | Credits | Validity |
|---|---:|---:|---:|
| 🆓 Free | ₹0 | 100 | 30 days |
| 🚀 Starter | ₹199 | 500 | 30 days |
| ⭐ Pro | ₹499 | 1000 | 30 days |

### Credit costs

| Operation | Credits |
|---|---:|
| 💬 Chat | 1 |
| 🔎 Search | 5 |
| 💻 Coding | 10 |
| 📄 PDF | 10 |
| 📊 PPT | 10 |
| 🎨 Vision / Image | 10 |

### Payment flow

```mermaid
flowchart LR
    A["👤 User"] --> B["⚛️ Frontend"]
    B --> C["💳 create-order"]
    C --> D["Razorpay"]
    D --> E["💰 Payment"]
    E --> F["verify-payment"]
    F --> G["HMAC-SHA256 Verification"]
    G --> H["🔐 Auth Service"]
    H --> I["Update Plan + Credits"]
    I --> J["⚡ Refresh Redis Session"]
```

---

# 📚 PDF-RAG Pipeline

PDF chat uses a dedicated retrieval pipeline:

```mermaid
flowchart LR
    A["📄 Upload PDF"]
    B["pdf-parse"]
    C["✂️ Chunk<br/>1000 chars / 200 overlap"]
    D["🧠 Gemini Embeddings"]
    E["🔷 Qdrant"]
    F["🔎 Top-5 Retrieval"]
    G["🤖 LLM"]
    H["💬 Grounded Answer"]

    A --> B --> C --> D --> E --> F --> G --> H
```

Each uploaded PDF receives an isolated Qdrant collection:

```text
pdf-<timestamp>
```

This keeps uploaded documents separated and avoids cross-document retrieval.

---

# ☁️ Artifact Storage

Generated files are uploaded to **AWS S3** instead of being kept permanently inside the application.

```mermaid
flowchart LR
    A["🤖 AI Agent"] --> B["📄 PDF / PPT / Image"]
    B --> C["☁️ AWS S3"]
    C --> D["🔗 Presigned URL"]
    D --> E["⚛️ Frontend"]
    E --> F["👤 User"]
```

Benefits:

- ☁️ External object storage
- 🔒 Expiring access URLs
- 📦 Reduced application-server storage
- ⚡ Direct user downloads

---

# 💻 Code Artifact System

The coding agent can return structured project files:

```js
{
  files: [
    {
      name: "index.html",
      content: "..."
    },
    {
      name: "style.css",
      content: "..."
    },
    {
      name: "script.js",
      content: "..."
    }
  ]
}
```

The frontend renders these through a **Monaco-based Artifact Viewer**, providing a development-environment-like experience.

```text
┌───────────────────────────────────────────────┐
│ 📁 Artifact                                  │
├───────────────┬───────────────────────────────┤
│ index.html    │                               │
│ style.css     │   📝 Monaco Editor            │
│ script.js     │                               │
│               │   Generated code              │
└───────────────┴───────────────────────────────┘
```

---

# 🧱 Repository Structure

```text
AI/
│
├── Backend/
│   ├── docker-compose.yml
│   ├── package.json
│   │
│   ├── shared/
│   │   └── redis/
│   │       └── redis.js
│   │
│   ├── gateway/
│   │   ├── index.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── Dockerfile
│   │
│   └── services/
│       │
│       ├── auth/
│       │   ├── controllers/
│       │   ├── models/
│       │   ├── config/
│       │   └── routes/
│       │
│       ├── chat/
│       │   ├── controllers/
│       │   ├── models/
│       │   └── routes/
│       │
│       ├── billing/
│       │   ├── controllers/
│       │   ├── config/
│       │   ├── models/
│       │   └── routes/
│       │
│       └── agent/
│           ├── graph/
│           ├── agents/
│           ├── config/
│           ├── utils/
│           ├── controllers/
│           └── Dockerfile
│
└── Frontend/
    └── vite-project/
        ├── src/
        │   ├── App.jsx
        │   ├── pages/
        │   ├── components/
        │   ├── features/
        │   ├── redux/
        │   └── utils/
        └── vite.config.*
```

---

# 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| ⚛️ React 19 | UI |
| ⚡ Vite | Development/build |
| 🎨 Tailwind CSS | Styling |
| 🧠 Redux Toolkit | State management |
| 🔥 Firebase SDK | Authentication |
| 📝 Monaco Editor | Code artifacts |
| 📜 React Markdown | AI responses |
| 🎞️ Motion | UI animations |
| 🌐 Axios | HTTP requests |

### Backend

| Technology | Purpose |
|---|---|
| 🟢 Node.js | Runtime |
| 🚂 Express 5 | API services |
| 🐳 Docker | Containerization |
| 🚪 API Gateway | Service routing |
| 🍃 MongoDB + Mongoose | Persistent data |
| ⚡ Redis + ioredis | Sessions + memory |
| 🔷 Qdrant | Vector database |
| 🧠 LangChain | LLM tooling |
| 🕸️ LangGraph | Agent orchestration |

### AI & Cloud

| Technology | Purpose |
|---|---|
| 🤖 Groq | Chat / routing / search |
| ✨ Google Gemini | Vision + embeddings |
| 🧠 OpenRouter / DeepSeek | Coding |
| 🔎 Tavily | Web search |
| 🎨 Pollinations AI | Image generation |
| ☁️ AWS S3 | Artifact storage |
| 💳 Razorpay | Payments |
| 🔥 Firebase | Authentication |

---

# 🌳 Data Model

### User

```text
firebaseUid
name
email
avatar
plan
credits
totalCredits
planExpiresAt
```

### Conversation

```text
title
userId
timestamps
```

### Message

```text
conversationId
role
content
images[]
artifacts[]
```

### Payment

```text
userId
orderId
amount
credits
plan
currency
status
paymentId
```

---

# 🌐 API Reference

All API requests are routed through the gateway.

> Protected routes require a valid `session` cookie.

| Method | Route | Service | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Auth | Verify Firebase token + create session |
| `POST` | `/api/auth/logout` | Auth | Destroy session |
| `GET` | `/api/me` | Gateway | Get current authenticated user |
| `POST` | `/api/chat/create-conversation` | Chat | Create conversation |
| `GET` | `/api/chat/conversations` | Chat | List conversations |
| `PATCH` | `/api/chat/update-conversation` | Chat | Rename conversation |
| `POST` | `/api/chat/save-message` | Chat | Persist message |
| `GET` | `/api/chat/messages/:conversationId` | Chat | Get conversation messages |
| `POST` | `/api/agent` | Agent | Run LangGraph AI pipeline |
| `POST` | `/api/billing/create-order` | Billing | Create Razorpay order |
| `POST` | `/api/billing/verify-payment` | Billing | Verify payment + upgrade plan |

> ⚠️ **Before publishing:** verify exact API paths against the current `routes/*.js` files.

---



Firebase client configuration should be supplied through `.env`.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd AI
```

## 2. Start Redis

From the backend directory:

```bash
cd Backend
docker-compose up -d
```

## 3. Configure infrastructure

Set up:

- MongoDB Atlas or local MongoDB
- Qdrant
- AWS S3 bucket
- Firebase project
- Razorpay test credentials
- Required AI provider API keys

## 4. Start backend services

Run each service independently:

```bash
cd gateway
npm install
npm run dev
```

```bash
cd services/auth
npm install
npm run dev
```

```bash
cd services/chat
npm install
npm run dev
```

```bash
cd services/billing
npm install
npm run dev
```

```bash
cd services/agent
npm install
npm run dev
```

## 5. Start frontend

```bash
cd Frontend/vite-project
npm install
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

---

# 🐳 Docker

Each backend service has its own `Dockerfile`.

The current `docker-compose.yml` is used to start **Redis**.

A future improvement would be to extend Compose to include:

```text
Gateway
Auth
Chat
Billing
Agent
Redis
MongoDB
```

for a single-command local environment.

---

# ⚡ Performance & Reliability

Several implementation details are designed to prevent unnecessary latency and resource usage.

### 🧠 Redis conversation memory

Recent conversation messages are cached per conversation:

```text
Conversation
      │
      ▼
Redis: messages-<conversationId>
      │
      ├── Cache hit → last 20 messages
      │
      └── Cache miss → Chat Service → MongoDB
```

### ⏱️ Timeout guards

The system includes timeout protection:

| Component | Timeout |
|---|---:|
| Router | 15s |
| General agents | 20s |
| Coding agent | 60s |

This prevents requests from hanging indefinitely.

---

# 🔒 Security & Cost-Conscious Design

AxioraAI uses several mechanisms to keep the system controlled:

- 🔐 Firebase identity verification
- 🍪 `httpOnly` session cookie
- ⚡ Redis session TTL
- 🪪 Internal `x-user-id` propagation
- 💳 Credit-based AI usage
- ☁️ Expiring S3 presigned URLs
- 📦 Generated artifacts stored outside the application server
- 📚 Isolated Qdrant collection per uploaded PDF
- ⏱️ Agent timeout guards

> Before making the repository public, rotate any credentials that may have been exposed and ensure `.env` and `serviceAccountKey.json` are ignored by Git.

---

```text
Prompt → Router → Agent → Response → Artifact
```

would provide more visual impact than many static screenshots.

---

# 🗺️ Roadmap

- [x] Production deployment on AWS (ECR + ECS + ALB)
- [x] Frontend delivery via CloudFront
- [x] CI/CD pipeline for automated build & deploy
- [ ] Full Docker Compose environment for local dev
- [ ] Automated service health checks
- [ ] Centralized logging
- [ ] Distributed tracing
- [ ] More specialized AI agents
- [ ] Improved artifact preview
- [ ] Production monitoring
- [ ] Automated API documentation

---

# ⭐ Why This Project Stands Out

AxioraAI demonstrates more than simply calling an LLM API.

It combines:

```text
                 ┌──────────────────────┐
                 │       AxioraAI       │
                 └──────────┬───────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
     🧠 AI Systems      🏗️ Backend        ☁️ Cloud
          │                 │                 │
      LangGraph         Microservices       AWS S3
      Multi-Agent       API Gateway         Docker
      RAG               MongoDB             Redis
      Vision            Redis               Qdrant
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
                    💳 Production SaaS
                    Firebase + Razorpay
```

The project therefore showcases:

**AI Engineering + Backend Engineering + Distributed Systems + Cloud + SaaS Architecture**

---

# 📌 Implementation Highlights

- **Conversation memory:** Redis caches the latest 20 messages per conversation and falls back to MongoDB on cache miss.
- **Artifact storage:** PDFs, PPTs and generated images are uploaded to S3 and exposed through expiring presigned URLs.
- **Code artifacts:** the coding agent returns structured files that the frontend renders with Monaco Editor.
- **Search composition:** the search agent retrieves Tavily results and passes state to the chat agent for final answer generation.
- **PDF-RAG isolation:** every uploaded PDF gets its own Qdrant collection.
- **Timeout protection:** router and agent operations are guarded against long-running requests.

---

## 👨‍💻 Project Structure at a Glance

```text
                 ┌───────────────┐
                 │  React Client │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ API Gateway   │
                 └───────┬───────┘
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
  🔐 Auth            💬 Chat           💳 Billing
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
                 ┌───────────────┐
                 │ 🧠 LangGraph │
                 └───────┬───────┘
                         │
       ┌─────────┬───────┼───────┬─────────┐
       ▼         ▼       ▼       ▼         ▼
     Chat     Search   Coding    RAG     Vision
                         │
                    PDF / PPT / Image
                         │
                         ▼
                      ☁️ S3
```

---
