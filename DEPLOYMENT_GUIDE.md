# 🚀 Deployment Guide - AI Virtual Teaching Assistant

Complete guide to deploy your AI Teaching Assistant to production so others can use it.

---

## 📋 **Pre-Deployment Checklist**

Before deploying, ensure you have:
- ✅ MongoDB Atlas account (free tier available)
- ✅ OpenAI API key
- ✅ Email service credentials (Gmail/SendGrid)
- ✅ All environment variables configured
- ✅ Code tested locally

---

## 🎯 **Deployment Options**

### **Option 1: Render (Recommended - Free Tier Available)**
### **Option 2: Railway**
### **Option 3: Heroku**
### **Option 4: DigitalOcean/AWS/Azure**
### **Option 5: Vercel (Frontend) + Render (Backend)**

---

## 🌟 **OPTION 1: Deploy to Render (Recommended)**

### **Why Render?**
- ✅ Free tier available
- ✅ Easy deployment from GitHub
- ✅ Automatic HTTPS
- ✅ Supports Node.js and static sites
- ✅ Good for Puppeteer (needs Chrome)

### **Step 1: Prepare Your Code**

1. **Create `.gitignore` if not exists:**
```
node_modules/
.env
backend/.env
dist/
build/
*.log
.DS_Store
```

2. **Create `render.yaml` in root:**
```yaml
services:
  # Backend Service
  - type: web
    name: ai-teaching-assistant-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: EMAIL_USER
        sync: false
      - key: EMAIL_PASS
        sync: false
      - key: FRONTEND_URL
        sync: false

  # Frontend Service
  - type: web
    name: ai-teaching-assistant-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        sync: false
```

### **Step 2: Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-teaching-assistant.git
git push -u origin main
```

### **Step 3: Deploy on Render**

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Random secure string (e.g., `openssl rand -base64 32`)
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `EMAIL_USER`: Your email address
   - `EMAIL_PASS`: Your email app password
   - `FRONTEND_URL`: Will be provided after frontend deploys
   - `VITE_API_URL`: Will be provided after backend deploys

6. Click "Apply" to deploy

### **Step 4: Update CORS Settings**

After deployment, update `backend/server.js` with your frontend URL:
```javascript
const corsOptions = {
  origin: ['https://your-frontend-url.onrender.com'],
  credentials: true
};
```

---

## 🌟 **OPTION 2: Deploy to Railway**

### **Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

### **Step 2: Login and Initialize**
```bash
railway login
railway init
```

### **Step 3: Deploy Backend**
```bash
cd backend
railway up
```

### **Step 4: Deploy Frontend**
```bash
cd ..
railway up
```

### **Step 5: Add Environment Variables**
Go to Railway dashboard and add all environment variables.

---

## 🌟 **OPTION 3: Deploy to Vercel + Render**

### **Frontend on Vercel (Best for React)**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy frontend:
```bash
vercel
```

3. Add environment variable:
   - `VITE_API_URL`: Your backend URL

### **Backend on Render**
Follow Option 1 steps for backend only.

---

## 🌟 **OPTION 4: Deploy to Heroku**

### **Step 1: Install Heroku CLI**
Download from [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)

### **Step 2: Create Heroku Apps**
```bash
# Login
heroku login

# Create backend app
heroku create ai-teaching-backend

# Create frontend app
heroku create ai-teaching-frontend
```

### **Step 3: Add Buildpacks**
```bash
# For backend (Puppeteer support)
heroku buildpacks:add jontewks/puppeteer -a ai-teaching-backend
heroku buildpacks:add heroku/nodejs -a ai-teaching-backend
```

### **Step 4: Set Environment Variables**
```bash
heroku config:set MONGODB_URI="your_mongodb_uri" -a ai-teaching-backend
heroku config:set JWT_SECRET="your_jwt_secret" -a ai-teaching-backend
heroku config:set OPENAI_API_KEY="your_openai_key" -a ai-teaching-backend
# ... add all other variables
```

### **Step 5: Deploy**
```bash
# Deploy backend
git subtree push --prefix backend heroku main

# Deploy frontend
git push heroku main
```

---

## 🌟 **OPTION 5: DigitalOcean/AWS/Azure (VPS)**

### **Step 1: Create a Droplet/VM**
- Ubuntu 22.04 LTS
- At least 2GB RAM (for Puppeteer)

### **Step 2: SSH into Server**
```bash
ssh root@your_server_ip
```

### **Step 3: Install Dependencies**
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Chrome dependencies for Puppeteer
apt install -y chromium-browser
```

### **Step 4: Clone and Setup**
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/ai-teaching-assistant.git
cd ai-teaching-assistant

# Setup backend
cd backend
npm install
cp .env.example .env
nano .env  # Add your environment variables

# Setup frontend
cd ..
npm install
npm run build
```

### **Step 5: Start with PM2**
```bash
# Start backend
cd backend
pm2 start server.js --name "ai-teaching-backend"

# Serve frontend with nginx or serve
npm install -g serve
pm2 start "serve -s dist -l 3000" --name "ai-teaching-frontend"

# Save PM2 configuration
pm2 save
pm2 startup
```

### **Step 6: Setup Nginx (Optional)**
```bash
apt install -y nginx

# Create nginx config
nano /etc/nginx/sites-available/ai-teaching-assistant
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
ln -s /etc/nginx/sites-available/ai-teaching-assistant /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### **Step 7: Setup SSL with Let's Encrypt**
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your_domain.com
```

---

## 🔧 **Environment Variables Setup**

Create these files before deployment:

### **Backend `.env`**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-teaching-assistant
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=sk-your-openai-api-key