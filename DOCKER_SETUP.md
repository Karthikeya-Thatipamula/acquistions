# 🐳 Docker Setup Guide - Acquisitions API

This guide explains how to run the Acquisitions API using Docker with different database configurations for development and production.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Development Setup (Neon Local)](#development-setup-neon-local)
- [Production Deployment (Neon Cloud)](#production-deployment-neon-cloud)
- [Database Migrations](#database-migrations)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Docker**: Version 20.10 or higher ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: Version 2.0 or higher (included with Docker Desktop)
- **Neon Account**: For production deployment ([Sign up](https://neon.tech))

Verify installation:
```bash
docker --version
docker-compose --version
```

---

## Architecture Overview

### Development Environment
```
┌─────────────────────────────────────────────┐
│  Developer Machine                          │
│                                             │
│  ┌─────────────┐      ┌─────────────────┐  │
│  │   App       │──────│  Neon Local     │  │
│  │ Container   │      │  (PostgreSQL)   │  │
│  │ :3000       │      │  :5432          │  │
│  └─────────────┘      └─────────────────┘  │
│         │                                   │
│         └── Hot reload from ./src          │
└─────────────────────────────────────────────┘
```

### Production Environment
```
┌─────────────────────┐         ┌──────────────────────┐
│   App Container     │────────│  Neon Cloud DB       │
│   :3000             │  TLS   │  (Serverless PG)     │
│   (production)      │────────│  neon.tech endpoint  │
└─────────────────────┘         └──────────────────────┘
```

---

## Development Setup (Neon Local)

### What is Neon Local?

**Neon Local** is a Docker-based PostgreSQL instance that mimics Neon's cloud environment locally. It allows you to:
- Develop with the same database engine as production
- Test database branching features
- Work offline without cloud dependencies

📚 [Learn more about Neon Local](https://neon.com/docs/local/neon-local)

---

### Step 1: Configure Environment

The `.env.development` file is already configured for Neon Local:

```bash
# .env.development
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
DATABASE_URL=postgresql://neondb_owner:localpassword@neon-local:5432/acquisitions_dev
JWT_SECRET=dev-jwt-secret-change-me-in-production
```

**⚠️ Note**: The `DATABASE_URL` in `docker-compose.dev.yml` overrides this file to ensure correct Docker networking.

---

### Step 2: Start Development Environment

#### Option A: Using Docker Compose (Recommended)

```bash
# Start all services (app + Neon Local)
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up -d --build
```

#### Option B: Start Services Separately

```bash
# Start Neon Local first
docker-compose -f docker-compose.dev.yml up -d neon-local

# Wait for database to be ready
docker-compose -f docker-compose.dev.yml exec neon-local pg_isready

# Start the app
docker-compose -f docker-compose.dev.yml up app
```

---

### Step 3: Verify Setup

1. **Check running containers**:
   ```bash
   docker ps
   ```
   
   You should see:
   - `acquisitions-app-dev` (port 3000)
   - `acquisitions-neon-local` (port 5432)

2. **Test API endpoints**:
   ```bash
   # Health check
   curl http://localhost:3000/health
   
   # API root
   curl http://localhost:3000/api
   ```

3. **Check logs**:
   ```bash
   # App logs
   docker-compose -f docker-compose.dev.yml logs -f app
   
   # Database logs
   docker-compose -f docker-compose.dev.yml logs -f neon-local
   ```

---

### Step 4: Database Operations

#### Run Migrations

Migrations run automatically on startup, but you can run them manually:

```bash
# Inside container
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Generate new migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:generate
```

#### Access Database Directly

```bash
# Connect to PostgreSQL shell
docker-compose -f docker-compose.dev.yml exec neon-local psql -U neondb_owner -d acquisitions_dev

# List tables
\dt

# Query users
SELECT * FROM users;

# Exit
\q
```

#### Open Drizzle Studio

```bash
# From host machine (requires npm install locally)
npm run db:studio

# Or from container
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

Open: `http://localhost:4983`

---

### Step 5: Hot Reloading

Changes to files in `./src` are automatically detected:

```bash
# Edit a file
echo "console.log('test');" >> src/app.js

# Watch logs to see reload
docker-compose -f docker-compose.dev.yml logs -f app
```

---

### Step 6: Stop Development Environment

```bash
# Stop and remove containers (preserves data)
docker-compose -f docker-compose.dev.yml down

# Stop and remove everything including volumes (⚠️ deletes database)
docker-compose -f docker-compose.dev.yml down -v
```

---

## Production Deployment (Neon Cloud)

### What is Neon Cloud?

**Neon Cloud** is a serverless PostgreSQL platform with:
- Auto-scaling and instant scaling to zero
- Database branching for instant dev/staging environments
- Built-in connection pooling
- Point-in-time restore

---

### Step 1: Set Up Neon Cloud Database

1. **Create Neon Project**:
   - Go to [Neon Console](https://console.neon.tech)
   - Click **"New Project"**
   - Name: `acquisitions-prod`
   - Region: Choose closest to your deployment

2. **Get Connection String**:
   - Navigate to **Dashboard → Connection Details**
   - Copy the connection string:
     ```
     postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
     ```

3. **Enable Connection Pooling** (Recommended):
   - In Neon Console: **Settings → Connection Pooling**
   - Enable pooling
   - Use the pooled connection string for production

---

### Step 2: Configure Production Environment

Edit `.env.production` with **real secrets**:

```bash
# .env.production
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Neon Cloud connection string
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/acquisitions_prod?sslmode=require

# Generate strong JWT secret
JWT_SECRET=<output-of-openssl-rand-base64-32>
```

**Generate JWT Secret**:
```bash
openssl rand -base64 32
```

**⚠️ SECURITY WARNING**:
- **NEVER** commit `.env.production` to Git
- Add to `.gitignore`: `echo ".env.production" >> .gitignore`
- Use secret management tools in production (AWS Secrets Manager, Vault, etc.)

---

### Step 3: Build Production Image

```bash
# Build optimized production image
docker build --target production -t acquisitions-api:latest .

# Or with docker-compose
docker-compose -f docker-compose.prod.yml build
```

**Image optimizations**:
- Multi-stage build (smaller image)
- Production dependencies only
- Non-root user for security
- Health checks included

---

### Step 4: Deploy to Production

#### Option A: Docker Compose on VPS

```bash
# Start production container
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Option B: Cloud Platform Deployment

**AWS ECS / Fargate**:
```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag acquisitions-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/acquisitions-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/acquisitions-api:latest
```

**Google Cloud Run**:
```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/acquisitions-api
gcloud run deploy acquisitions-api --image gcr.io/PROJECT_ID/acquisitions-api --platform managed
```

**Fly.io** (uses Dockerfile automatically):
```bash
fly launch
fly deploy
```

---

### Step 5: Environment Variable Injection

#### Docker Compose (Direct)

```bash
# Pass env vars at runtime
DATABASE_URL="postgresql://..." JWT_SECRET="..." docker-compose -f docker-compose.prod.yml up -d
```

#### Cloud Platforms

**AWS ECS**:
- Store secrets in **AWS Secrets Manager**
- Reference in task definition:
  ```json
  "secrets": [
    {
      "name": "DATABASE_URL",
      "valueFrom": "arn:aws:secretsmanager:region:account:secret:prod/db/url"
    }
  ]
  ```

**Kubernetes**:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  DATABASE_URL: <base64-encoded-url>
  JWT_SECRET: <base64-encoded-secret>
```

---

### Step 6: Verify Production Deployment

```bash
# Health check
curl https://your-domain.com/health

# Check database connection
docker-compose -f docker-compose.prod.yml exec app node -e "require('dotenv/config'); console.log(process.env.DATABASE_URL.includes('neon.tech'))"
# Should output: true
```

---

## Database Migrations

### Development

```bash
# Generate migration after schema changes
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Apply migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
```

### Production

**⚠️ Caution**: Always test migrations in staging first!

```bash
# Backup database first (Neon Console → Backups → Create Backup)

# Apply migrations
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate

# Verify
docker-compose -f docker-compose.prod.yml exec app node -e "require('@neondatabase/serverless'); console.log('Connected')"
```

**Best Practice**: Use Neon's **database branching** for testing migrations:
1. Create branch in Neon Console
2. Update `DATABASE_URL` to branch URL
3. Test migration
4. Merge branch or apply to main

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution**:
```bash
# Check if Neon Local is running
docker-compose -f docker-compose.dev.yml ps neon-local

# Verify health
docker-compose -f docker-compose.dev.yml exec neon-local pg_isready -U neondb_owner

# Restart database
docker-compose -f docker-compose.dev.yml restart neon-local
```

---

### Issue: "Port 3000 already in use"

**Solution**:
```bash
# Find process using port
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Linux/Mac:
lsof -i :3000

# Change port in docker-compose
ports:
  - "3001:3000"  # Host:Container
```

---

### Issue: "Hot reload not working"

**Solution**:
```bash
# Ensure volume mount is correct
docker-compose -f docker-compose.dev.yml exec app ls -la /app/src

# Restart with fresh mount
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build
```

---

### Issue: "Migration fails in production"

**Solution**:
```bash
# Check Neon connection
docker-compose -f docker-compose.prod.yml exec app node -e "console.log(process.env.DATABASE_URL)"

# Verify SSL requirement
# Neon requires sslmode=require in connection string

# Check migration files exist
docker-compose -f docker-compose.prod.yml exec app ls -la /app/drizzle
```

---

### Issue: "Logs not persisting"

**Solution**:
```bash
# Ensure logs directory exists and is writable
mkdir -p logs
chmod 755 logs

# Check volume mount
docker-compose -f docker-compose.dev.yml exec app ls -la /app/logs
```

---

## Quick Reference

### Common Commands

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d --build   # Start dev environment
docker-compose -f docker-compose.dev.yml logs -f app     # View app logs
docker-compose -f docker-compose.dev.yml down            # Stop dev environment

# Production
docker-compose -f docker-compose.prod.yml up -d          # Start prod environment
docker-compose -f docker-compose.prod.yml ps             # Check status
docker-compose -f docker-compose.prod.yml logs -f        # View logs

# Database
docker-compose -f docker-compose.dev.yml exec neon-local psql -U neondb_owner -d acquisitions_dev
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
docker-compose -f docker-compose.dev.yml exec app npm run db:studio

# Cleanup
docker-compose -f docker-compose.dev.yml down -v         # Remove volumes (⚠️ deletes data)
docker system prune -a                                   # Remove unused images
```

---

## Environment Comparison

| Feature | Development (Neon Local) | Production (Neon Cloud) |
|---------|-------------------------|-------------------------|
| **Database** | Local PostgreSQL in Docker | Neon serverless PostgreSQL |
| **Connection** | `neon-local:5432` | `*.neon.tech:5432` (TLS) |
| **Hot Reload** | ✅ Enabled | ❌ Disabled |
| **Logging** | Debug level, console + files | Info level, files only |
| **Volumes** | Source code mounted | Only logs mounted |
| **Secrets** | Hardcoded (safe for dev) | Environment variables |
| **Scaling** | Manual | Auto-scaling |
| **Backups** | Manual Docker volumes | Automatic by Neon |

---

## Security Checklist

- [ ] `.env.production` added to `.gitignore`
- [ ] Strong JWT secret generated (`openssl rand -base64 32`)
- [ ] Neon Cloud connection uses `sslmode=require`
- [ ] Production secrets stored in secret manager (AWS/GCP/Azure)
- [ ] Docker image runs as non-root user
- [ ] Rate limiting configured (if using proxy)
- [ ] Health checks enabled
- [ ] Logs reviewed for sensitive data

---

## Additional Resources

- [Neon Documentation](https://neon.com/docs)
- [Neon Local Setup](https://neon.com/docs/local/neon-local)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Drizzle ORM Migrations](https://orm.drizzle.team/docs/migrations)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-production.html)

---

## Support

For issues specific to:
- **Application**: Open an issue in this repository
- **Neon Database**: [Neon Support](https://neon.tech/docs/introduction/support)
- **Docker**: [Docker Community Forum](https://forums.docker.com/)
