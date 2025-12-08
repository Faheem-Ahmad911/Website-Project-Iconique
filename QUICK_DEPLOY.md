# ⚡ Quick Vercel Deployment (5 Minutes)

## 1️⃣ GitHub Setup (2 min)

```powershell
cd "e:\Website-Project-Iconique"
git init
git add .
git commit -m "Ready for Vercel"
git remote add origin https://github.com/YOUR_USERNAME/Website-Project-Iconique.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## 2️⃣ Vercel Setup (2 min)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

---

## 3️⃣ Add Environment Variables (1 min)

In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add these 3 variables to all environments:

```
GMAIL_USER = theiconique79@gmail.com
GMAIL_PASS = tmwi fiao utqm qdus
OWNER_EMAIL = faheemofficial1515@gmail.com
```

---

## 4️⃣ Deploy & Test

1. Vercel auto-deploys (watch the progress)
2. Get your URL: `https://website-project-iconique-xyz.vercel.app`
3. Test by placing an order
4. Check your email for confirmation

---

## ✅ Done!

Your website is now live! 🎉

**Access at:** https://website-project-iconique-xyz.vercel.app

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 500 Error | Check environment variables in Vercel Settings |
| Emails not sending | Verify GMAIL credentials match `.env.example` |
| Static files 404 | Check `vercel.json` is in project root |

---

**Questions? See: VERCEL_DEPLOYMENT_GUIDE.md**
