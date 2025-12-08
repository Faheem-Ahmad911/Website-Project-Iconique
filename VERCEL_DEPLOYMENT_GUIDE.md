# 🚀 Vercel Deployment Guide - The Iconique

## Overview
This guide will help you deploy your website and email service to Vercel for free.

---

## 📋 Prerequisites

1. **GitHub Account** - You'll need to push your code to GitHub
2. **Vercel Account** - Free at https://vercel.com
3. **Project Setup** - All files should be ready (they are!)

---

## Step 1: Push Code to GitHub

### 1.1 Initialize Git (if not already done)
```powershell
cd "e:\Website-Project-Iconique"
git init
git add .
git commit -m "Initial commit with email system"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create repository: `Website-Project-Iconique`
3. **Don't** initialize with README
4. Click "Create repository"

### 1.3 Add Remote and Push
```powershell
cd "e:\Website-Project-Iconique"
git remote add origin https://github.com/YOUR_USERNAME/Website-Project-Iconique.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Connect to Vercel

### 2.1 Link Vercel to GitHub
1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 2.2 Import Project
1. In Vercel dashboard, click **"New Project"**
2. Click **"Import Git Repository"**
3. Find and select **"Website-Project-Iconique"**
4. Click **"Import"**

---

## Step 3: Configure Environment Variables

### 3.1 Set Up Environment Variables in Vercel
1. In Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add these three variables:

| Name | Value |
|------|-------|
| `GMAIL_USER` | `theiconique79@gmail.com` |
| `GMAIL_PASS` | `tmwi fiao utqm qdus` |
| `OWNER_EMAIL` | `faheemofficial1515@gmail.com` |

3. For each variable:
   - Select all environments: **Production**, **Preview**, **Development**
   - Click **Save**

### 3.2 Verify Environment Variables
You should see:
```
✅ GMAIL_USER (3 environments)
✅ GMAIL_PASS (3 environments)
✅ OWNER_EMAIL (3 environments)
```

---

## Step 4: Deploy

### 4.1 Deploy Automatically
Vercel will automatically deploy from your latest GitHub push.

You should see:
```
✅ Building...
✅ Deployment successful
```

### 4.2 Get Your Vercel URL
Once deployed, you'll see a URL like:
```
https://website-project-iconique-xyz.vercel.app
```

---

## Step 5: Test Production

### 5.1 Access Your Website
1. Go to: `https://website-project-iconique-xyz.vercel.app`
2. Add products to cart
3. Go to checkout
4. Fill in form and place order
5. Check your email for confirmation

### 5.2 Check Logs
If email doesn't send:
1. In Vercel dashboard, go to **Deployments** → **Latest Deployment**
2. Click **Function Logs**
3. Look for error messages

---

## 📊 Project Structure on Vercel

```
Your Vercel Deployment
├── API Routes: /api/send-order-emails
│   └── Handles email sending via Node.js
├── Static Files: /
│   ├── index.html
│   ├── checkout/checkout.html
│   ├── public/
│   └── etc.
├── Firebase: Automatically connected
└── Email Service: Uses Gmail SMTP
```

---

## 🔄 Making Updates

### To update your site:
1. Make changes locally in VS Code
2. Commit and push to GitHub:
   ```powershell
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Vercel automatically deploys new changes
4. Check status at: https://vercel.com/dashboard

---

## 🆘 Troubleshooting

### Problem: "Function Error" or "500 Error"

**Solution:**
1. Check Environment Variables in Vercel Settings
2. Verify Gmail credentials are correct
3. Check Function Logs for error message
4. Make sure `.env` is in `.gitignore` (it is)

### Problem: Emails not sending

**Solution:**
1. Verify GMAIL_PASS is correct (it's the App Password, not your Gmail password)
2. Check that GMAIL_USER is: `theiconique79@gmail.com`
3. Restart the deployment: Click **Deployments** → **Latest** → **Redeploy**

### Problem: Static files returning 404

**Solution:**
1. Verify `vercel.json` is correct
2. Check that `public/` folder has all files
3. Redeploy: `git push` or click Redeploy in Vercel

---

## ✅ Deployment Checklist

- [ ] GitHub account created
- [ ] Repository pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported in Vercel
- [ ] Environment variables set (all 3)
- [ ] Deployment successful (✅ green checkmark)
- [ ] Website loads at Vercel URL
- [ ] Can add products to cart
- [ ] Checkout form works
- [ ] Test order placed
- [ ] Emails received successfully
- [ ] Owner notification received

---

## 📱 Site Information

| Item | Details |
|------|---------|
| **Domain** | https://website-project-iconique-xyz.vercel.app |
| **Backend** | Serverless Node.js on Vercel |
| **Database** | Firebase Firestore |
| **Email** | Gmail SMTP via Nodemailer |
| **Hosting** | Vercel Free Plan |

---

## 💰 Pricing

**Vercel Free Plan includes:**
- ✅ Unlimited deployments
- ✅ Unlimited bandwidth
- ✅ Free SSL certificate
- ✅ Serverless functions (up to 50 invocations/month for free)
- ✅ 100 GB bandwidth/month

Your email service uses serverless functions, so costs are minimal.

---

## 🔐 Security Notes

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Environment variables are secure** - Stored encrypted in Vercel
3. **Gmail credentials** - Use App Passwords, not your main password
4. **CORS** - Configured for your Vercel domain automatically

---

## 📞 Support

If deployment fails:
1. Check Vercel Function Logs
2. Verify Environment Variables
3. Check GitHub repository is public
4. Look for error messages in browser console (F12)

---

## 🎉 Success!

Once deployed, your website will be:
- ✅ Live on the internet
- ✅ Fast with CDN
- ✅ Scalable automatically
- ✅ Sending emails automatically
- ✅ Storing orders in Firebase
- ✅ Free to run

**Congratulations on going live! 🚀**

---

## Next Steps (Optional)

1. **Custom Domain**: Buy a domain and connect it to Vercel
2. **Monitoring**: Set up Sentry for error tracking
3. **Analytics**: Add Google Analytics
4. **Backups**: Enable automatic Firebase backups
5. **Caching**: Optimize images and static assets

