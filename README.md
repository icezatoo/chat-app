# Plodnee Chat — Frontend

Thai debt-advisory chatbot UI. Customers chat with the Plodnee AI advisor to analyze debt, calculate repayment plans, and get negotiation guidance.

**Stack:** Next.js 16 · Auth.js v5 · Tailwind CSS v4 · TypeScript · Keycloak SSO

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime |
| npm | 9+ | Package manager |
| Keycloak | 22+ | Identity provider (SSO) |
| Go backend | — | Chat API + WebSocket (`chat-service`) |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example and fill in the values:

```bash
cp .env .env.local
```

Edit `.env.local`:

```env
# Auth.js secret — generate with: openssl rand -base64 32
AUTH_SECRET=<generated-secret>

# Keycloak client credentials
AUTH_KEYCLOAK_ID=chat-app
AUTH_KEYCLOAK_SECRET=<client-secret-from-keycloak>
AUTH_KEYCLOAK_ISSUER=http://localhost:8080/realms/debtmind

# Go backend URL
NEXT_PUBLIC_API_URL=http://localhost:8090
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Set up Keycloak

1. Start Keycloak (default port `8080`)
2. Create a realm named **`debtmind`**
3. Create a client:
   - **Client ID:** `chat-app`
   - **Client type:** OpenID Connect
   - **Access type:** Confidential
   - **Standard flow:** Enabled
   - **Valid redirect URIs:** `http://localhost:3000/*`
   - **Web origins:** `http://localhost:3000`
4. Copy the client secret from the **Credentials** tab → paste as `AUTH_KEYCLOAK_SECRET`

### 4. Start the Go backend

The chat-service must be running before you start the frontend. From the `chat-service` directory:

```bash
go run .
# or
make dev
```

It should be listening on `http://localhost:8090`. The frontend uses:
- `POST /sessions` — create a chat session
- `GET /sessions` — list sessions
- `GET /sessions/:id/messages` — message history
- `ws://localhost:8090/ws?token=<jwt>` — WebSocket chat

> **Note:** The WebSocket endpoint must accept the JWT as a `?token=` query parameter because browsers cannot set `Authorization` headers on WebSocket connections.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to `/th` (Thai locale) and prompted to sign in via Keycloak SSO.

---

## Available commands

```bash
npm run dev      # Start dev server (Turbopack, port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npx tsc --noEmit # Type-check without building
```

---

## Project structure

```
src/
├── app/
│   ├── [lang]/           # Locale-prefixed routes (/th, /en)
│   │   ├── (chat)/       # Protected chat UI
│   │   └── login/        # Sign-in page
│   ├── api/auth/         # Auth.js route handler
│   └── globals.css       # Plodnee design system
├── components/
│   ├── auth/             # Login screen
│   └── chat/             # Sidebar, messages, composer, topbar
├── dictionaries/         # i18n strings (th.json, en.json)
├── hooks/
│   └── use-chat.ts       # WebSocket + session state
├── lib/
│   ├── api.ts            # HTTP client for chat-service
│   ├── dictionaries.ts   # Server-side locale loader
│   ├── i18n-context.tsx  # useDictionary() / useLocale() hooks
│   └── types.ts          # Shared domain types
├── auth.ts               # Auth.js + Keycloak config
└── proxy.ts              # Locale detection + route protection
```

---

## Internationalization

The app supports Thai (`/th`) and English (`/en`). The locale is detected from:
1. `NEXT_LOCALE` cookie (set when the user clicks the language switcher)
2. `Accept-Language` request header
3. Default: `th`

All UI strings live in `src/dictionaries/`.
