# Acquisitions API — Enterprise-Grade Backend Service

> A production-ready RESTful API for managing acquisitions with enterprise-grade security, authentication, and automated CI/CD pipelines. Built with modern backend best practices and comprehensive error handling.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Security](#security)
- [Database](#database)
- [Testing & Quality](#testing--quality)
- [CI/CD Pipelines](#cicd-pipelines)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Acquisitions API** is a full-featured backend service designed for managing acquisition workflows. It demonstrates enterprise-level backend engineering practices including:

- **JWT-based authentication** with role-based access control (RBAC)
- **Advanced security** with Helmet, CORS, Arcjet bot detection, and rate limiting
- **Automated CI/CD** with GitHub Actions (linting, testing, Docker builds)
- **Multi-platform containerization** for seamless deployment
- **Comprehensive testing** with Jest and supertest
- **Type-safe database** operations with Drizzle ORM
- **Professional error handling** and structured logging

This project is ideal for portfolios, interviews, and production deployments.

---

## Key Features

✅ **User Authentication & Authorization**
- Secure JWT token generation and verification  
- Role-based access control (admin, user, guest)
- Password hashing with bcryptjs

✅ **Security & Protection**
- Helmet for HTTP headers security
- CORS configuration for cross-origin requests
- Arcjet bot detection and DDoS rate limiting  
- Input validation with Zod schemas
- Request sanitization and error masking

✅ **Database Management**
- PostgreSQL with Neon serverless integration
- Drizzle ORM for type-safe queries
- Automatic migrations and schema management
- Drizzle Studio for visual database exploration

✅ **API Best Practices**
- RESTful endpoint design
- Structured error responses with semantic HTTP status codes
- Request/response logging with Winston
- Pagination and filtering support
- Comprehensive input validation

✅ **Testing & Quality Assurance**
- Unit and integration tests with Jest
- Supertest for API endpoint testing
- Test coverage reporting
- ESLint for code consistency
- Prettier for automatic code formatting

✅ **CI/CD Automation**
- GitHub Actions workflows for lint, test, and build
- Multi-platform Docker builds (amd64, arm64)
- Automated Docker Hub image pushing
- Test coverage artifacts
- Deployment-ready annotations

---

## Technology Stack

### Backend Framework
- **Node.js 20.x** — JavaScript runtime
- **Express 5.1** — Web framework
- **TypeScript-ready** — ES modules with import aliases

### Database & ORM
- **PostgreSQL** — Relational database (via Neon serverless)
- **Drizzle ORM 0.44** — Type-safe, zero-runtime ORM
- **Neon HTTP Driver** — Serverless Postgres adapter

### Authentication & Security
- **JWT (jsonwebtoken)** — Token-based authentication
- **Bcryptjs** — Password hashing
- **Helmet 8.1** — HTTP security headers
- **CORS** — Cross-origin resource sharing
- **Arcjet** — Bot detection & rate limiting
- **Zod 4.1** — Runtime schema validation

### Development Tools
- **ESLint 9.36** — Code linting
- **Prettier 5.5** — Code formatting
- **Jest 30.2** — Unit and integration testing
- **Supertest 7.1** — HTTP assertion library
- **Winston 3.18** — Structured logging

### DevOps & CI/CD
- **Docker** — Containerization
- **Docker Compose** — Multi-container orchestration
- **GitHub Actions** — Automated workflows
- **drizzle-kit** — Database migrations

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                   Client (Web/Mobile)                   │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────────────┐
│                   API Gateway / CDN                      │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────────────────────┐
│                  Security Middleware                      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Helmet │ CORS │ Arcjet (Bot Detection, Rate Limit)  │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│              Authentication Middleware                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │ JWT Token Verification │ Role-Based Access       │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   Route Handlers                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ Auth API   │  │ Users API  │  │ ...Others  │        │
│  └────┬───────┘  └────┬───────┘  └────┬───────┘        │
└───────┼────────────────┼────────────────┼──────────────┘
        │                │                │
┌───────▼────────────────▼────────────────▼──────────────┐
│              Business Logic (Services)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Auth Service │  │ User Service │  │ ...Services  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└───────┬───────────────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────────────────┐
│            Data Access Layer (Drizzle ORM)              │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Type-Safe Query Builder │ Connection Pooling      │ │
│  └────────────────────────────────────────────────────┘ │
└───────┬─────────────────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────────────────┐
│          PostgreSQL Database (Neon Serverless)          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Users Table │ Audit Logs │ Sessions │ ...         │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Layers

1. **Presentation Layer** — Express routes, request handlers
2. **Middleware Layer** — Authentication, security, logging
3. **Business Logic** — Services with core domain logic
4. **Data Access** — Drizzle ORM for database operations
5. **Database** — PostgreSQL with Neon serverless

---

## Project Structure

```
acquisitions/
├── src/
│   ├── app.js                 # Express app setup
│   ├── index.js               # Server entry point
│   ├── server.js              # Server configuration
│   ├── config/
│   │   ├── database.js        # Drizzle ORM & Neon config
│   │   ├── logger.js          # Winston logging setup
│   │   └── arcjet.js          # Arcjet security config
│   ├── controllers/           # Route handlers
│   │   ├── auth.controller.js
│   │   └── users.controller.js
│   ├── routes/                # API route definitions
│   │   ├── auth.routes.js
│   │   └── users.routes.js
│   ├── services/              # Business logic
│   │   ├── auth.service.js
│   │   └── users.service.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── security.middleware.js
│   ├── models/                # Database schemas
│   │   └── user.model.js
│   ├── validations/           # Zod schemas
│   │   ├── auth.validation.js
│   │   └── users.validation.js
│   └── utils/                 # Helper functions
│       ├── jwt.js
│       ├── cookies.js
│       └── format.js
├── tests/
│   └── app.test.js            # Integration tests
├── .github/workflows/         # CI/CD pipelines
│   ├── lint-and-format.yml
│   ├── tests.yml
│   └── docker-build-and-push.yml
├── drizzle/                   # Database migrations
├── Dockerfile                 # Multi-stage Docker image
├── docker-compose.dev.yml     # Development environment
├── docker-compose.prod.yml    # Production environment
├── jest.config.mjs            # Jest testing config
├── eslint.config.js           # ESLint rules
├── .prettierrc                # Prettier formatting
└── package.json               # Dependencies & scripts
```

---

## Quick Start

### Prerequisites

- **Node.js 20.x** or higher
- **npm** or **yarn**
- **Docker** (optional, for containerized setup)
- **Neon account** (free tier available at [neon.tech](https://neon.tech))

### Installation

```bash
# Clone the repository
git clone https://github.com/Karthikeya-Thatipamula/acquisitions.git
cd acquisitions

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.development

# Update .env.development with your Neon database URL:
# DATABASE_URL=postgresql://user:password@neon-endpoint/db

# Run database migrations
npm run db:migrate

# Start development server (with auto-reload)
npm run dev

# Server runs at: http://localhost:3000
```

### Environment Setup

Create a `.env.development` file:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Database (Neon Cloud)
DATABASE_URL=postgresql://neondb_owner:password@host.neon.tech/database?sslmode=require

# JWT
JWT_SECRET=dev-jwt-secret-change-in-production

# Arcjet (Security)
ARCJET_KEY=your-arcjet-key
```

---

## API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### **Sign Up** — Register a new user
```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"  // optional: "user" or "admin" (default: "user")
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2025-01-15T10:00:00.000Z"
}
```

#### **Sign In** — Authenticate and get JWT
```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookie Set:**
```
Set-Cookie: auth_token=eyJhbGci...; HttpOnly; Secure; SameSite=Strict
```

### User Endpoints

#### **Get All Users** — Admin only
```http
GET /api/users
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2025-01-15T10:00:00.000Z"
  }
]
```

#### **Get User by ID** — Authenticated users only
```http
GET /api/users/1
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2025-01-15T10:00:00.000Z"
}
```

#### **Update User** — Own profile or admin
```http
PUT /api/users/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "user",
  "updated_at": "2025-01-15T10:15:00.000Z"
}
```

#### **Delete User** — Admin only
```http
DELETE /api/users/1
Authorization: Bearer <token>
```

**Response (204 No Content)**

### Health Check

```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "uptime": 1234.56
}
```

### Error Responses

All errors follow a consistent format:

```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

**Common HTTP Status Codes:**
- `200` — Success
- `201` — Created
- `204` — No Content (success, no response body)
- `400` — Bad Request (invalid input)
- `401` — Unauthorized (authentication required)
- `403` — Forbidden (insufficient permissions)
- `404` — Not Found
- `500` — Internal Server Error

---

## Authentication

### JWT Flow

1. **Sign In** → Server validates credentials and returns JWT + sets `auth_token` cookie
2. **Request** → Client sends JWT (via header or cookie)
3. **Verify** → Middleware verifies token signature and expiration
4. **Authorize** → Role-based access control applied

### Token Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Payload:**
```json
{
  "id": 1,
  "email": "john@example.com",
  "role": "user",
  "iat": 1705311600,
  "exp": 1705398000
}
```

**Token Expiration:** 24 hours

### Sending Token in Postman

**Option 1: Cookie (Recommended)**
1. Go to `Cookies` button (Postman UI)
2. Add cookie: `auth_token=<your_jwt>`
3. Send request

**Option 2: Authorization Header**
1. Go to `Headers` tab
2. Add: `Authorization: Bearer <your_jwt>`
3. Send request

See [POSTMAN_EXAMPLES.md](./POSTMAN_EXAMPLES.md) for detailed Postman setup.

---

## Security

### Built-In Protections

| Feature | Library | Purpose |
|---------|---------|---------|
| **HTTP Headers** | Helmet 8.1 | Prevents XSS, clickjacking, MIME sniffing |
| **CORS** | CORS 2.8 | Controls cross-origin requests |
| **Bot Detection** | Arcjet | Blocks automated scrapers/bots |
| **Rate Limiting** | Arcjet | Sliding window per user role |
| **Password Hashing** | Bcryptjs | Salted PBKDF2 hashing |
| **Input Validation** | Zod | Schema validation on all inputs |
| **Request Logging** | Morgan | Audit trail of all requests |
| **Structured Logging** | Winston | Security event tracking |

### Rate Limits (by Role)

- **Admin:** 20 requests/minute
- **User:** 10 requests/minute
- **Guest:** 5 requests/minute

### Security Best Practices

✓ Passwords hashed with bcryptjs (10 salt rounds)
✓ JWTs expire after 24 hours
✓ Environment variables for secrets (no hardcoding)
✓ HTTPS enforced in production
✓ Helmet CSP and security headers enabled
✓ CORS restricted to trusted origins
✓ Request validation on all endpoints
✓ SQL injection prevention via Drizzle ORM

---

## Database

### Schema

**Users Table:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Migrations

Drizzle migrations are version-controlled in `drizzle/`:

```bash
# Generate migration from schema changes
npm run db:generate

# Apply pending migrations
npm run db:migrate

# Explore database visually
npm run db:studio
```

### Connection

- **Provider:** Neon (PostgreSQL serverless)
- **Driver:** Neon HTTP (edge-compatible)
- **ORM:** Drizzle 0.44
- **Connection Pooling:** Managed by Neon

---

## Testing & Quality

### Run Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Coverage Report

After running tests, view coverage at:
```
coverage/lcov-report/index.html
```

Expected coverage:
- Statements: 90%+
- Branches: 85%+
- Functions: 90%+
- Lines: 90%+

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Check code formatting
npm run format:check

# Auto-format code
npm run format
```

### Test Stack

- **Framework:** Jest 30.2
- **HTTP Testing:** Supertest 7.1
- **Assertions:** Jest built-in matchers
- **Coverage:** Istanbul (built into Jest)

---

## CI/CD Pipelines

### GitHub Actions Workflows

Located in `.github/workflows/`:

#### **1. lint-and-format.yml** — Code Quality
- **Trigger:** Push/PR to `main`, `staging`
- **Steps:**
  - Checkout code
  - Setup Node.js 20.x + npm cache
  - Run ESLint
  - Run Prettier check
  - Fail with guidance if issues found
- **Output:** Annotations in PR with fix commands

#### **2. tests.yml** — Testing & Coverage
- **Trigger:** Push/PR to `main`, `staging`
- **Steps:**
  - Checkout code
  - Setup Node.js 20.x + npm cache
  - Install dependencies
  - Run Jest with coverage
  - Upload coverage artifact (30-day retention)
  - Generate step summary
  - Annotate failures
- **Environment:** `NODE_ENV=test`, `NODE_OPTIONS=--experimental-vm-modules`

#### **3. docker-build-and-push.yml** — Build & Registry
- **Trigger:** Push to `main` or manual `workflow_dispatch`
- **Steps:**
  - Setup QEMU (ARM64 support)
  - Setup Buildx
  - Login to Docker Hub
  - Extract metadata (tags, labels)
  - Build multi-platform image (amd64, arm64)
  - Push to Docker Hub with caching
  - Publish summary with image name & tags
- **Image Registry:** Docker Hub
- **Platforms:** `linux/amd64`, `linux/arm64`

### Workflow Secrets Required

Set these in GitHub repo Settings → Secrets:

| Secret | Value | Used By |
|--------|-------|---------|
| `DOCKER_USERNAME` | Docker Hub username | docker-build-and-push |
| `DOCKER_PASSWORD` | Docker Hub personal access token | docker-build-and-push |
| `DATABASE_URL` | Neon connection string | tests |

### Running Workflows Manually

```bash
# Trigger via GitHub CLI
gh workflow run docker-build-and-push.yml --ref main

# Or via UI: Actions → Select workflow → "Run workflow"
```

---

## Deployment

### Docker

```bash
# Build production image
docker build --target production -t acquisitions:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  acquisitions:latest
```

### Docker Compose

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Platforms

**Recommended Deployments:**
- **Heroku** — `git push heroku main`
- **Railway.app** — Connect GitHub repo, auto-deploy
- **Fly.io** — `flyctl deploy`
- **AWS ECS/Fargate** — Via GitHub Actions
- **Google Cloud Run** — Serverless container
- **DigitalOcean App Platform** — Simple UI-based deployment

### Environment Variables (Production)

```env
PORT=3000
NODE_ENV=production
LOG_LEVEL=warn

DATABASE_URL=postgresql://prod-user:prod-password@prod-host/prod-db?sslmode=require
JWT_SECRET=<generate-strong-secret>
ARCJET_KEY=<production-key>
```

---

## Development

### Local Setup

```bash
npm install
npm run dev
```

Server runs at `http://localhost:3000` with auto-reload enabled.

### Database Exploration

```bash
npm run db:studio
```

Opens Drizzle Studio at `http://localhost:4983`

### Code Style

The project uses:
- **ESLint** — Code quality
- **Prettier** — Automatic formatting
- **Editor Config** — IDE consistency

All files are pre-formatted on commit (Husky hooks available if configured).

---

## Contributing

### Code Standards

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Write tests** for new code
4. **Lint & Format:** `npm run lint:fix && npm run format`
5. **Commit** with clear messages: `git commit -m "feat: add user roles"`
6. **Push** and create a Pull Request

### Commit Convention

```
feat: add new feature
fix: fix a bug
docs: update documentation
refactor: refactor code
test: add tests
chore: dependency updates
```

### PR Checklist

- ✅ Tests pass: `npm test`
- ✅ Linting passes: `npm run lint`
- ✅ Code formatted: `npm run format`
- ✅ No console logs (except logs/errors)
- ✅ Documentation updated
- ✅ Commit messages follow convention

---

## License

ISC License — See [LICENSE](./LICENSE) for details.

---

## Author

**Karthikeya Thatipamula**

- GitHub: [@Karthikeya-Thatipamula](https://github.com/Karthikeya-Thatipamula)
- Repository: [acquisitions](https://github.com/Karthikeya-Thatipamula/acquisitions)

---

## Support & Resources

- 📚 [Express Documentation](https://expressjs.com)
- 🗄️ [Drizzle ORM Guide](https://orm.drizzle.team)
- 🛡️ [Helmet Security](https://helmetjs.github.io)
- 🧪 [Jest Testing](https://jestjs.io)
- 🐳 [Docker & Containerization](https://docker.com)
- 🔐 [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

---

**Built with ❤️ using Node.js, Express, Drizzle, and modern DevOps practices.**

