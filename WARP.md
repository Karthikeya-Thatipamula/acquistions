# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Running the Application
- **Start dev server**: `npm run dev` (uses Node's `--watch` flag for hot reloading)
- **Server runs on**: `http://localhost:3000` (configurable via `PORT` environment variable)

### Code Quality
- **Lint code**: `npm run lint`
- **Fix lint issues**: `npm run lint:fix`
- **Format code**: `npm run format`
- **Check formatting**: `npm run format:check`

### Database (Drizzle ORM)
- **Generate migrations**: `npm run db:generate` (from schema changes in `src/models/*.js`)
- **Run migrations**: `npm run db:migrate`
- **Open Drizzle Studio**: `npm run db:studio` (web-based database browser)

## Architecture Overview

### Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Auth**: JWT with httpOnly cookies
- **Logging**: Winston

### Project Structure

The codebase follows a layered architecture with path aliases defined in `package.json`:

```
src/
├── config/         # Database connection, logger setup
├── models/         # Drizzle ORM schema definitions (*.model.js)
├── routes/         # Express route definitions
├── controllers/    # Request handlers (validation + orchestration)
├── services/       # Business logic layer
├── validations/    # Zod schemas for request validation
└── utils/          # Shared utilities (JWT, cookies, formatting)
```

### Path Aliases
Import modules using `#` aliases (defined in `package.json` imports field):
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Request Flow
1. **Routes** (`src/routes/*.js`) define endpoints
2. **Controllers** (`src/controllers/*.js`) validate input with Zod schemas
3. **Services** (`src/services/*.js`) contain business logic and database operations
4. **Models** (`src/models/*.js`) define Drizzle ORM table schemas

### Key Patterns

#### Database Access
- Use `db` from `#config/database.js` for queries
- Model schemas use Drizzle's `pgTable` API
- All database operations happen in the service layer

#### Authentication
- JWT tokens are signed in controllers after successful auth
- Tokens stored as httpOnly cookies via `cookies` utility from `#utils/cookies.js`
- Token expiration: 1 day (configured in `src/utils/jwt.js`)
- Cookie max age: 15 minutes (configured in `src/utils/cookies.js`)

#### Validation
- Zod schemas defined in `src/validations/*.js`
- Controllers call `.safeParse()` and return formatted errors via `formatValidationError()`
- Validation errors return 400 status with details

#### Logging
- Winston logger configured in `src/config/logger.js`
- Logs to `logs/error.log` (errors only) and `logs/combined.log` (all levels)
- Console output in development only
- HTTP requests logged via Morgan middleware

#### Error Handling
- Service layer throws descriptive errors (e.g., "User not found")
- Controllers catch and map to appropriate HTTP status codes
- Unhandled errors passed to Express error handler via `next(e)`

## Environment Configuration

Required environment variables (see `.env.example`):
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `LOG_LEVEL` - Winston log level (default: info)
- `DATABASE_URL` - PostgreSQL connection string (Neon serverless)
- `JWT_SECRET` - Secret key for JWT signing (critical for production)

## Code Style

### ESLint Rules (enforced)
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Unix line endings
- No `var`, prefer `const`
- Arrow functions over function expressions
- Object shorthand syntax

### Prettier
- Configuration in `.prettierrc`
- Ignored paths in `.prettierignore`
