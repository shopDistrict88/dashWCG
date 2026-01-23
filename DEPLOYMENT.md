# WCG Dashboard - Deployment Guide

## 🚀 Production Deployment

### Option 1: Vercel (Recommended - Fastest)

**Why Vercel?**
- Optimized for React/Next.js
- Free tier available
- Auto-deployment on git push
- Global CDN
- Serverless functions
- One-click rollback

#### Steps

1. **Create GitHub Repository**
```bash
cd c:\Users\kjwil\wcgdashboard
git init
git add .
git commit -m "Initial WCG Dashboard commit"
git branch -M main
```

2. **Push to GitHub**
```bash
# Create repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/wcgdashboard.git
git push -u origin main
```

3. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select "Import Git Repository"
   - Find your wcgdashboard repository
   - Click "Import"

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add: `VITE_OPENAI_API_KEY` with your OpenAI API key
   - Deploy → Redeploy

5. **Custom Domain (Optional)**
   - Settings → Domains
   - Add your custom domain
   - Update DNS records with Vercel's nameservers

**Your app is now live at:** `wcgdashboard.vercel.app`

---

### Option 2: Netlify (Alternative)

**Why Netlify?**
- Simple drag-and-drop
- Free SSL
- Good for static sites
- Git integration available

#### Steps

1. **Build Locally First**
```bash
npm run build
```
This creates a `dist/` folder with your production build.

2. **Deploy on Netlify**
   - Go to https://netlify.com
   - Drag & drop the `dist/` folder into the deploy area
   - OR connect your GitHub repo for auto-deployment

3. **Add Environment Variables (if using GitHub)**
   - Site Settings → Environment
   - Add `VITE_OPENAI_API_KEY` if desired

**Your app is now live at:** `YOUR_SITE.netlify.app`

---

### Option 3: AWS Amplify

#### Steps

1. **Connect GitHub & Deploy**
```bash
# Install AWS Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Configure build
# Set build command: npm run build
# Set output directory: dist
```

2. **Deploy**
```bash
amplify publish
```

**Your app is now live on AWS CloudFront**

---

### Option 4: Docker Container

**Why Docker?**
- Portable across any server
- Consistent environment
- Easy scaling

#### Steps

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist dist
RUN npm install -g http-server
EXPOSE 3000
CMD ["http-server", "dist", "-p", "3000"]
```

2. **Build Image**
```bash
docker build -t wcg-dashboard .
```

3. **Run Locally**
```bash
docker run -p 3000:3000 wcg-dashboard
```

4. **Push to Docker Hub**
```bash
docker tag wcg-dashboard YOUR_USERNAME/wcg-dashboard:latest
docker push YOUR_USERNAME/wcg-dashboard:latest
```

5. **Deploy to Cloud**
   - **DigitalOcean App Platform**: Connect GitHub or Docker Hub
   - **Heroku**: `git push heroku main`
   - **AWS ECS**: Create task definition and cluster
   - **Google Cloud Run**: `gcloud run deploy`

---

### Option 5: Traditional VPS (DigitalOcean, Linode, etc.)

1. **Create Droplet/Server** (Ubuntu 22.04 recommended)

2. **SSH into Server**
```bash
ssh root@YOUR_SERVER_IP
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/wcgdashboard.git
cd wcgdashboard
```

5. **Install Dependencies & Build**
```bash
npm install
npm run build
```

6. **Install PM2 (Process Manager)**
```bash
npm install -g pm2
```

7. **Start App**
```bash
pm2 start "npm run preview" --name "wcg-dashboard"
pm2 startup
pm2 save
```

8. **Setup Nginx Reverse Proxy**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80 default_server;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

9. **Enable SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

10. **Restart Nginx**
```bash
sudo systemctl restart nginx
```

---

## 📊 Performance Optimization

### Before Deployment

1. **Run Production Build**
```bash
npm run build
```
Check bundle size is ~106 KB gzipped (acceptable).

2. **Analyze Bundle**
```bash
npm install -D vite-plugin-visualizer
```
Add to vite.config.ts and check bundle composition.

3. **Optimize Images**
- Use WebP format where possible
- Compress PNGs/JPGs
- Consider CDN for media

---

## 🔐 Security Checklist

Before going live:

- [ ] HTTPS enabled (auto on Vercel/Netlify)
- [ ] Secure headers configured
- [ ] Environment variables not in code
- [ ] API keys stored securely
- [ ] CORS properly configured
- [ ] Rate limiting on API (if backend)
- [ ] XSS protection headers
- [ ] CSRF tokens (if needed)
- [ ] Regular security updates
- [ ] Error messages don't leak info

---

## 📈 Monitoring & Analytics

### Add Google Analytics
```javascript
// Add to main.tsx
import { useEffect } from 'react'

function GoogleAnalytics() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'G-MEASUREMENT_ID')
  }, [])
  return null
}
```

### Error Tracking (Sentry)
```bash
npm install @sentry/react @sentry/tracing
```

---

## 🚀 Auto-Deployment Setup

### GitHub Actions (Vercel auto-deployment)

Already works automatically when connected!

### GitHub Actions (Custom Deploy)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

---

## 💾 Database Setup (Future)

When ready to add backend:

### Firebase
```bash
npm install firebase
```

### Supabase
```bash
npm install @supabase/supabase-js
```

### PostgreSQL + Node.js
```bash
npm install express pg cors dotenv
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions for Testing

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run type-check
```

---

## 📊 Recommended Deployment Summary

### For Production:
**→ Use Vercel** (best for React)
- Auto-deploys on git push
- Free tier: 3 projects
- Pro tier: $20/month
- Includes CDN, analytics, and git integration

### Quick Start Command:
```bash
# Just push to GitHub and connect to Vercel
git push origin main
# Then deploy from https://vercel.com
```

---

## 🆘 Troubleshooting

### Build fails on Vercel
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API key not working
- Check VITE_OPENAI_API_KEY is set
- Verify API key is valid (not expired)
- Check OpenAI account has credits

### Site not loading
- Check domain DNS settings
- Verify SSL certificate
- Check browser console for errors
- Review deployment logs

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- TypeScript Docs: https://www.typescriptlang.org

---

**🎉 Your app is ready for production!**
