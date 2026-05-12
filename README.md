# Meta Page Description Manager

Backend service that integrates with **Meta Graph API** and **LLM APIs** to automatically generate and update descriptions for Facebook Pages.

---

## Solution Overview

The service allows users to:

1. **Authenticate** using Meta OAuth to get access to their Facebook Pages
2. **Sync** Pages from Meta Graph API into a local MongoDB database
3. **Generate** a new description for any Page using an LLM (OpenAI, Anthropic or Gemini)
4. **Apply** the generated description back to the Meta Page using Meta Graph API

### Design Decisions

- **Adapter Pattern** — `MetaApiAdapter` isolates all Meta Graph API communication. If Meta changes their API, only the adapter need to be changed.
- **Strategy Pattern** — LLM providers (OpenAI, Anthropic, Gemini) are interchangeable strategies. Adding a new provider requires only a new strategy file.
- **Repository Pattern** — `PagesRepository` extends a generic `BaseRepository`, decoupling business logic from database implementation.
- **Factory Pattern** — `LlmStrategyFactory` selects the active LLM strategy based on config at startup.

---

## Tech Stack

| Layer            | Technology                            |
| ---------------- | ------------------------------------- |
| Framework        | NestJS                                |
| Language         | TypeScript                            |
| Database         | MongoDB + Mongoose                    |
| HTTP Client      | Native Node.js fetch                  |
| LLM              | OpenAI / Anthropic Claude / Gemini    |
| Validation       | Joi (config) + class-validator (DTOs) |
| Documentation    | Swagger / OpenAPI                     |
| Testing          | Jest                                  |
| Containerization | Docker + docker-compose               |
| Tunnel           | ngrok                                 |
| Code Quality     | ESLint + Prettier + Husky             |

---

### Prerequisites

- Docker + docker-compose
- Meta Developer App ([developers.facebook.com](https://developers.facebook.com))
- OpenAI, Anthropic or Gemini (recommended for free requests) API key
- ngrok account ([dashboard.ngrok.com](https://dashboard.ngrok.com))

### 1. Clone and configure

```bash
git clone <repository-url>
cd meta-api-with-llm

cp .env.example .env
```

Fill in `.env`.

### 2. Get ngrok URL

Start ngrok first to get a URL for Meta OAuth redirect:

```bash
docker-compose up ngrok
```

Get the public URL:

```bash
# Option 1 — browser dashboard
open http://localhost:4040

# Option 2 — docker logs
docker-compose logs ngrok | grep url
```

### 3. Configure Meta App

Go to [developers.facebook.com](https://developers.facebook.com) -> Your App:

```
App Settings -> Basic
  Copy: App ID -> META_APP_ID
  Copy: App Secret -> META_APP_SECRET

Facebook Login -> Settings -> Valid OAuth Redirect URIs
  Add: https://YOUR_NGROK_URL/auth/meta/callback
```

Update `.env`:

```env
META_REDIRECT_URI=https://YOUR_NGROK_URL/auth/meta/callback
```

### 4. Start the application

```bash
docker-compose up --build
```

Services started:

| Service         | URL                              |
| --------------- | -------------------------------- |
| API             | <http://localhost:3000>          |
| Swagger         | <http://localhost:3000/api/docs> |
| MongoDB         | mongodb://localhost:27017        |
| ngrok dashboard | <http://localhost:4040>          |

---

## API Documentation

Full interactive documentation available at `http://localhost:3000/api/docs` (Swagger UI).

### Endpoints

| Method | Path                          | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| `GET`  | `/auth/meta/init`             | Start Meta OAuth flow          |
| `GET`  | `/auth/meta/callback`         | Handle OAuth callback          |
| `GET`  | `/api/pages`                  | Get all synced pages           |
| `POST` | `/api/pages/sync`             | Sync pages from Meta API       |
| `GET`  | `/api/pages/:pageId`          | Get single page                |
| `POST` | `/api/pages/:pageId/generate` | Generate description using LLM |
| `POST` | `/api/pages/:pageId/apply`    | Apply description to Meta      |

---

## Technical Specification

### Functional Requirements

#### 1. Meta API Integration (Auth)

- OAuth 2.0 authorization flow with CSRF state protection
- Short-lived token exchange for long-lived token

#### 2. Fetch User Pages

- Retrieve list of user's Facebook Pages using Meta Graph API `/me/accounts`
- Batch fetch page descriptions to avoid N+1 problem
- Sync pages to MongoDB with upsert

#### 3. LLM Integration

- Support multiple LLM providers using Strategy Pattern (OpenAI, Anthropic, Gemini)
- Generate page description from static or custom prompt
- Generated description validated to ≤ 255 characters

#### 4. Update Page Data

- Apply generated description to Meta Page using Graph API
- Update local MongoDB record after successful Meta update

#### 5. Minimal UI

- Swagger UI available at `/api/docs`
- Static HTML page at `/` displaying OAuth token after redirect
