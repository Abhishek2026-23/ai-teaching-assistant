# ⚡ Quick Deploy Reference Card

## 🔑 What You Need

| Item | Where to Get | Example |
|------|-------------|---------|
| **MongoDB URI** | mongodb.com/cloud/atlas | `mongodb+srv://user:pass@cluster.mongodb.net/ai-teaching-assistant` |
| **JWT Secret** | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | `a1b2c3d4e5f6...` (64 chars) |
| **OpenAI API Key** | platform.openai.com/api-keys | `sk-proj-...` |
| **Email User** | Your Gmail address | `yourname@gmail.com` |
| **Email Password** | myaccount.google.com/apppasswords | `abcd efgh ijkl mnop` |

---

## 🚀 Deploy Commands

```bash
# 1. Initialize and push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-teaching-assistant.git
git branch -M main
git push -u origin main

# 2. Go to render.com → New Blueprint → Connect GitHub repo

# 3. Add environment variables in Render dashboard

# 4. After deploy, update CORS in backend/server.js
git add backend/server.js
git commit -m "Update CORS"
git push
```

---

## 🌐 URLs After Deployment

| Service | URL Pattern | Use For |
|---------|------------|---------|
| **Backend** | `https://ai-teaching-assistant-backend.onrender.com` | Set as `FRONTEND_URL` (backend env) |
| **Backend API** | `https://ai-teaching-assistant-backend.onrender.com/api` | Set as `VITE_API_URL` (frontend env) |
| **Frontend** | `https://ai-teaching-assistant-frontend.onrender.com` | Share with users |
| **Health Check** | `https://ai-teaching-assistant-backend.onrender.com/api/health` | Test backend |

---

## ✅ Environment Variables Checklist

### Backend (.env)
```
✅ NODE_ENV=production
✅ PORT=5000
✅ MONGODB_URI=mongodb+srv://...
✅ JWT_SECRET=your_secret_here
✅ OPENAI_API_KEY=sk-...
✅ EMAIL_USER=your@gmail.com
✅ EMAIL_PASS=your_app_password
✅ FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend (.env)
```
✅ VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🔧 CORS Update

In `backend/server.js`, replace:
```javascript
app.use(cors());
```

With:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.onrender.com'],
  credentials: true
}));
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Backend won't start** | Check all env vars are set in Render |
| **CORS error** | Update CORS in server.js with correct frontend URL |
| **Can't connect to DB** | Check MongoDB URI, whitelist 0.0.0.0/0 in Atlas |
| **Emails not sending** | Use Gmail App Password, not regular password |
| **Slow first load** | Normal on free tier (spins down after 15 min) |

---

## 📊 Test Checklist

After deployment:
- [ ] Visit frontend URL
- [ ] Sign up for account
- [ ] Check email received
- [ ] Login successfully
- [ ] Create a meeting
- [ ] Meeting appears in dashboard
- [ ] Visit `/api/health` endpoint

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid Option |
|---------|-----------|-------------|
| **Render** | 750 hrs/month | $7/month (no spin-down) |
| **MongoDB Atlas** | 512MB | $9/month (2GB) |
| **OpenAI** | Pay per use | ~$0.002 per 1K tokens |
| **Vercel** | Unlimited | Free for personal |
| **Total** | **FREE** | ~$16/month |

---

## 🎯 Deployment Time

- Setup accounts: **15 minutes**
- Push to GitHub: **5 minutes**
- Deploy on Render: **10 minutes**
- Configure & test: **10 minutes**

**Total: ~40 minutes** ⏱️

---

## 📞 Support Resources

- **Render Docs:** docs.render.com
- **MongoDB Docs:** docs.mongodb.com
- **OpenAI Docs:** platform.openai.com/docs
- **Render Status:** status.render.com

---

**Quick Tip:** Bookmark this page for easy reference during deployment! 🔖
