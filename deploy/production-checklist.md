# ⚠️ **GUARDRAILS REMOVED - JUNE 12, 2025**

**This production checklist is now OUTDATED as the entire Guardrails AI system has been completely removed from the application.**

**Current Status:**
- ✅ No Guardrails API to deploy
- ✅ Application uses standard frontend-only deployment
- ✅ No Python backend dependencies
- ✅ Simplified deployment process

---

# Production Deployment Checklist (OUTDATED)

## API Deployment (Guardrails Server)

### Option A: Railway Deployment (Recommended)
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and create project
railway login
railway init

# 3. Configure environment
cp guardrails/api_production.py guardrails/main.py
railway add
railway deploy
```

### Option B: Heroku Deployment
```bash
# 1. Create Procfile
echo "web: python guardrails/api_working.py" > Procfile

# 2. Create requirements.txt
echo "fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4" > requirements.txt

# 3. Deploy to Heroku
heroku create sorriso-guardrails-api
git add .
git commit -m "Deploy Guardrails API"
git push heroku main
```

### Option C: DigitalOcean App Platform
```yaml
# app.yaml
name: sorriso-guardrails-api
services:
- name: api
  source_dir: /
  github:
    repo: your-repo
    branch: main
  run_command: python guardrails/api_working.py
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
```

## Frontend Configuration Update

### Update API endpoints in production
```typescript
// src/config/api.ts
export const API_CONFIG = {
  GUARDRAILS_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com'  // Replace with actual URL
    : 'http://localhost:8000',
  
  ENDPOINTS: {
    health: '/health',
    metrics: '/metrics',
    validate: {
      chat: '/validate/chat',
      appointment: '/validate/appointment', 
      emergency: '/validate/emergency',
      clinical: '/validate/clinical'
    }
  }
}
```

## PWA Production Optimization

### Service Worker Production Config
```javascript
// public/sw.js updates for production
const CACHE_NAME = 'sorriso-v1.0.0';
const API_BASE = 'https://your-api-domain.com';

// Add API endpoints to cache strategy
const API_ENDPOINTS = [
  `${API_BASE}/health`,
  `${API_BASE}/metrics`,
  `${API_BASE}/validate/chat`,
  `${API_BASE}/validate/appointment`,
  `${API_BASE}/validate/emergency`,
  `${API_BASE}/validate/clinical`
];
```

## Production Deployment Steps

1. **Deploy API** (Choose option A, B, or C above)
2. **Update frontend API config** with production URL
3. **Test API integration** with production endpoints
4. **Deploy frontend** to Vercel/Netlify
5. **Test full PWA functionality** in production
6. **Monitor performance** and error rates

## Post-Deployment Verification

### Health Checks
- [ ] API health endpoint responds
- [ ] All validation endpoints working
- [ ] PWA installs correctly
- [ ] Background sync functional
- [ ] Offline mode works
- [ ] Update notifications appear

### Performance Monitoring
- [ ] API response times < 500ms
- [ ] PWA lighthouse score > 90
- [ ] Cache hit ratio > 80%
- [ ] Error rate < 1%
