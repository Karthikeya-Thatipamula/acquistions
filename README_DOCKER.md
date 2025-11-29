# 🐳 Quick Start with Docker

## TL;DR - Get Started in 30 Seconds

### Development (Windows PowerShell)

```powershell
# Start everything
.\dev.ps1 start

# View logs
.\dev.ps1 logs

# Stop when done
.\dev.ps1 stop
```

### Development (Linux/Mac)

```bash
# Make script executable
chmod +x dev.sh

# Start everything
./dev.sh start

# View logs
./dev.sh logs

# Stop when done
./dev.sh stop
```

Your API will be running at: **http://localhost:3000**

---

## What You Get

### Development Environment

- ✅ **Neon Local PostgreSQL** running in Docker (no cloud needed)
- ✅ **Hot reload** - changes to `src/` auto-restart the app
- ✅ **Database migrations** run automatically on startup
- ✅ **Logs** persisted to `./logs`
- ✅ **Isolated** - won't conflict with other local projects

### Production Environment

- ✅ **Connects to Neon Cloud** (serverless PostgreSQL)
- ✅ **Optimized Docker image** (multi-stage build, ~150MB)
- ✅ **Health checks** built-in
- ✅ **Non-root user** for security
- ✅ **Resource limits** configured

---

## First Time Setup

### 1. Install Docker

- **Windows/Mac**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

Verify:

```bash
docker --version
docker-compose --version
```

### 2. Start Development Environment

```powershell
# Windows
.\dev.ps1 start

# Linux/Mac
./dev.sh start
```

### 3. Test Your API

```bash
# Health check
curl http://localhost:3000/health

# Create a user
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

---

## Development Commands

### Windows PowerShell

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `.\dev.ps1 start`   | Start all services           |
| `.\dev.ps1 stop`    | Stop all services            |
| `.\dev.ps1 restart` | Restart services             |
| `.\dev.ps1 logs`    | View live logs               |
| `.\dev.ps1 migrate` | Run database migrations      |
| `.\dev.ps1 studio`  | Open Drizzle Studio          |
| `.\dev.ps1 db`      | Connect to PostgreSQL shell  |
| `.\dev.ps1 clean`   | Remove all containers & data |

### Linux/Mac Bash

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `./dev.sh start`   | Start all services           |
| `./dev.sh stop`    | Stop all services            |
| `./dev.sh restart` | Restart services             |
| `./dev.sh logs`    | View live logs               |
| `./dev.sh migrate` | Run database migrations      |
| `./dev.sh studio`  | Open Drizzle Studio          |
| `./dev.sh db`      | Connect to PostgreSQL shell  |
| `./dev.sh clean`   | Remove all containers & data |

---

## Production Deployment

### Step 1: Get Neon Cloud Connection String

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project (or use existing)
3. Copy the connection string from **Dashboard → Connection Details**

### Step 2: Configure Production Environment

Edit `.env.production`:

```bash
DATABASE_URL=postgresql://user:pass@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
JWT_SECRET=$(openssl rand -base64 32)
```

### Step 3: Deploy

```bash
# Build and start production container
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

---

## Troubleshooting

### "Port 3000 already in use"

```powershell
# Windows - Find and kill process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or change port in docker-compose.dev.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

### "Database connection refused"

```bash
# Check if database is healthy
docker ps

# Restart database
docker-compose -f docker-compose.dev.yml restart neon-local

# View database logs
docker-compose -f docker-compose.dev.yml logs neon-local
```

### "Hot reload not working"

```bash
# Rebuild containers
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build
```

### "Migration failed"

```bash
# Run manually
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Check migration files
docker-compose -f docker-compose.dev.yml exec app ls -la /app/drizzle
```

---

## Manual Docker Commands

If you prefer not to use the convenience scripts:

```bash
# Start development
docker-compose -f docker-compose.dev.yml up -d --build

# Start production
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop all
docker-compose -f docker-compose.dev.yml down

# Remove volumes (⚠️ deletes data)
docker-compose -f docker-compose.dev.yml down -v

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache
```

---

## Database Access

### Access PostgreSQL Shell

```bash
# Via convenience script
.\dev.ps1 db  # Windows
./dev.sh db   # Linux/Mac

# Or directly
docker-compose -f docker-compose.dev.yml exec neon-local psql -U neondb_owner -d acquisitions_dev
```

### Common SQL Commands

```sql
-- List tables
\dt

-- Describe users table
\d users

-- Query users
SELECT * FROM users;

-- Count users
SELECT COUNT(*) FROM users;

-- Exit
\q
```

### Drizzle Studio (Visual Database Browser)

```bash
# Start Drizzle Studio
.\dev.ps1 studio  # Windows
./dev.sh studio   # Linux/Mac

# Open in browser
# http://localhost:4983
```

---

## Environment Variables

### Development (`.env.development`)

```bash
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgresql://neondb_owner:localpassword@neon-local:5432/acquisitions_dev
JWT_SECRET=dev-jwt-secret-change-me-in-production
```

### Production (`.env.production`)

```bash
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
JWT_SECRET=<generate-with-openssl-rand-base64-32>
```

**⚠️ Security**: Never commit `.env.production` to Git!

---

## File Structure

```
.
├── Dockerfile                  # Multi-stage build
├── docker-compose.dev.yml      # Development with Neon Local
├── docker-compose.prod.yml     # Production with Neon Cloud
├── .dockerignore               # Exclude files from image
├── .env.development            # Dev environment vars
├── .env.production             # Prod environment vars (not in Git)
├── dev.sh                      # Convenience script (Linux/Mac)
├── dev.ps1                     # Convenience script (Windows)
└── DOCKER_SETUP.md             # Detailed documentation
```

---

## Performance Notes

### Development

- **First build**: ~2-3 minutes (downloads Node.js image + npm install)
- **Subsequent builds**: ~10-30 seconds (uses Docker cache)
- **Hot reload**: Instant (watches `src/` directory)

### Production

- **Image size**: ~150MB (Alpine Linux + Node.js + app)
- **Build time**: ~1-2 minutes
- **Startup time**: ~3-5 seconds
- **Memory usage**: ~100-200MB

---

## Cloud Deployment Examples

### AWS ECS (Fargate)

```bash
# Build and push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
docker build --target production -t acquisitions-api:latest .
docker tag acquisitions-api:latest $ECR_REGISTRY/acquisitions-api:latest
docker push $ECR_REGISTRY/acquisitions-api:latest

# Deploy via ECS task definition
aws ecs update-service --cluster prod --service acquisitions-api --force-new-deployment
```

### Google Cloud Run

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/$PROJECT_ID/acquisitions-api
gcloud run deploy acquisitions-api \
  --image gcr.io/$PROJECT_ID/acquisitions-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Fly.io

```bash
# Initialize and deploy (uses Dockerfile automatically)
fly launch
fly deploy

# Set secrets
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set JWT_SECRET="..."
```

---

## Security Checklist

Before deploying to production:

- [ ] Strong JWT secret generated (`openssl rand -base64 32`)
- [ ] `.env.production` added to `.gitignore`
- [ ] Neon connection string uses `sslmode=require`
- [ ] Secrets stored in cloud secret manager (not in files)
- [ ] Docker image runs as non-root user (✅ already configured)
- [ ] Health checks enabled (✅ already configured)
- [ ] Rate limiting configured (add middleware)
- [ ] CORS origins restricted (update `app.js`)

---

## Next Steps

1. ✅ Read full documentation: [DOCKER_SETUP.md](./DOCKER_SETUP.md)
2. 🔧 Add authentication middleware for protected routes
3. 📊 Set up monitoring (Sentry, New Relic, etc.)
4. 🚀 Deploy to your preferred cloud platform
5. 📝 Set up CI/CD pipeline (GitHub Actions, GitLab CI, etc.)

---

## Support & Resources

- **Full Documentation**: [DOCKER_SETUP.md](./DOCKER_SETUP.md)
- **Neon Docs**: https://neon.com/docs
- **Docker Docs**: https://docs.docker.com
- **Issues**: Open an issue in this repository
