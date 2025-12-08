# 📧 Complete Email System Setup & Testing Guide

## Overview
Your website now has an automated email system that:
- ✅ Sends order confirmations to customers
- ✅ Notifies owner of new orders
- ✅ Stores orders in Firebase Firestore
- ✅ Maintains local backup copies
- ✅ Beautiful HTML email templates

---

## 🎯 Complete Setup Instructions

### Prerequisites Check
- [ ] Node.js installed (check: `node -v`)
- [ ] npm installed (check: `npm -v`)
- [ ] Access to the project folder
- [ ] A working internet connection

---

## Step 1: Install Dependencies (One-Time)

**Run this only ONCE:**

```powershell
cd "e:\Website-Project-Iconique"
npm install
```

This installs:
- ✅ express (web server)
- ✅ nodemailer (email service)
- ✅ cors (cross-origin support)
- ✅ dotenv (environment variables)

**Output should show:**
```
added XX packages in X.XXs
```

---

## Step 2: Verify Files

Check these files exist in `e:\Website-Project-Iconique\`:

```
✅ server.js                 (Email backend)
✅ .env                      (Credentials)
✅ package.json              (Dependencies)
✅ EMAIL_SETUP_GUIDE.md      (Documentation)
✅ QUICK_START_EMAIL.md      (Quick reference)
✅ public/checkout/checkout.js  (Updated with email function)
```

---

## Step 3: Every Time You Want to Use The System

### Open Terminal 1: Start Email Server

```powershell
cd "e:\Website-Project-Iconique"
npm start
```

**Expected Output:**
```
✅ Server is running on http://localhost:5000
📧 Email Service: The Iconique Order Notifications
📬 Sender Email: theiconique79@gmail.com

Server started at [current time]
```

**⚠️ IMPORTANT: Keep this terminal open!**

---

### Open Terminal 2: Start Website Server

```powershell
cd "e:\Website-Project-Iconique"
npx http-server -p 8000
```

**Expected Output:**
```
Starting up http-server, serving ./public

http-server version: 14.1.1

Available on:
  http://127.0.0.1:8000
  http://192.168.x.x:8000
```

**⚠️ IMPORTANT: Keep this terminal open!**

---

## Step 4: Test the Complete System

### 4.1 Access the Website
Open your browser and go to:
```
http://localhost:8000
```

You should see the home page.

### 4.2 Add Products to Cart
- Browse collections
- Click "Add to Cart" on products
- You should see cart count increase

### 4.3 Go to Checkout
Click the shopping cart icon or navigate to:
```
http://localhost:8000/checkout/checkout.html
```

### 4.4 Fill Checkout Form

**Required Information:**
```
First Name:     John
Last Name:      Doe
Email:          your-email@gmail.com  ← USE YOUR REAL EMAIL
Phone:          03260720251
Country:        Pakistan
City:           Karachi
Address:        123 Main Street
Postal Code:    75600 (optional)
```

**Then:**
- ☑️ Check "Save Information & Subscribe"
- Click "Complete Order"

### 4.5 Watch the Magic

**In the browser:**
- Button changes to "Processing..."
- After 2-3 seconds: Success message
- Redirected to home page

**In Terminal 1 (Email Server):**
```
✅ Order emails sent successfully for Order ID: ORD-1234567890-ABC123D
```

**In Terminal 2 (Website Server):**
```
[timestamp] "POST /api/send-order-emails" ...
```

---

## Step 5: Check Your Emails

### Check Customer Email
1. Go to your email inbox (the one you entered in checkout form)
2. Look for: **"Order Confirmation - The Iconique"**
3. Should show:
   - Order ID
   - All products with quantities
   - Subtotal, discount, shipping
   - Total amount
   - Delivery address
   - Professional header with logo

### Check Owner Email
1. Go to: **faheemofficial1515@gmail.com** (or login directly)
2. Look for: **"New Order Received - The Iconique"**
3. Should show:
   - Alert: "NEW ORDER RECEIVED"
   - Customer information
   - All products ordered
   - Amount to collect (for Cash on Delivery)
   - Delivery address

### If Email Not Found
1. Check **SPAM/JUNK** folder
2. Check email address was typed correctly
3. Check both servers are still running
4. Check browser console for errors (F12)

---

## 📊 Email Service Architecture

```
┌─────────────────────┐
│  Checkout Page      │ (Client-side)
│  (localhost:8000)   │
└──────────┬──────────┘
           │
           │ Submit order
           │ Save to Firebase
           │
           ▼
┌─────────────────────┐
│  Email Server       │ (localhost:5000)
│  (Node.js)          │
│  - Receives order   │
│  - Creates emails   │
│  - Sends via Gmail  │
└──────────┬──────────┘
           │
           │ SMTP
           │
           ▼
┌─────────────────────┐
│  Gmail SMTP Server  │
│  (Google)           │
└──────────┬──────────┘
           │
           ├─► Customer Email
           │   (Order Confirmation)
           │
           └─► Owner Email
               (Order Notification)
```

---

## 🔐 Email Credentials Used

| Setting | Value |
|---------|-------|
| Sender Email | `theiconique79@gmail.com` |
| App Password | `tmwi fiao utqm qdus` |
| Owner Email | `faheemofficial1515@gmail.com` |
| Email Server | Gmail SMTP |

---

## 🚨 Troubleshooting

### Problem: Emails not sending

**Check 1: Are both servers running?**
```powershell
# Terminal 1 should show:
✅ Server is running on http://localhost:5000

# Terminal 2 should show:
Available on:
  http://127.0.0.1:8000
```

**Check 2: Did you use correct email in checkout form?**
- Email field should be your real email address
- Typos prevent order confirmation from reaching you

**Check 3: Check spam/junk folder**
- Gmail sometimes marks new senders as spam
- Add `theiconique79@gmail.com` to contacts

**Check 4: Look at server console errors**
```powershell
# In Terminal 1, look for:
❌ Error sending emails: [error message]
```

### Problem: "Port already in use"

```powershell
# For port 5000:
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# For port 8000:
netstat -ano | findstr :8000
taskkill /PID [PID] /F
```

### Problem: Dependencies not installed

```powershell
# Remove and reinstall:
cd "e:\Website-Project-Iconique"
rm -r node_modules
rm package-lock.json
npm install
```

---

## 📋 What Gets Stored in Firebase

Each order automatically stores:
```javascript
{
  orderId: "ORD-1234567890-ABC123D",
  email: "customer@example.com",
  firstName: "John",
  lastName: "Doe",
  address: "123 Main St",
  apartment: "Suite 100",
  city: "Karachi",
  postalCode: "75600",
  country: "Pakistan",
  phone: "+923260720251",
  items: [
    {
      name: "Product Name",
      price: 1500,
      quantity: 2,
      image: "..."
    }
  ],
  subtotal: 3000,
  discount: 500,
  shipping: 250,
  total: 2750,
  paymentMethod: "cash_on_delivery",
  orderDate: "2025-12-09T10:30:00.000Z",
  status: "pending",
  timestamp: [Server timestamp from Firebase]
}
```

---

## 🔄 Order Processing Flow

```
1. User fills checkout form
   ↓
2. User clicks "Complete Order"
   ↓
3. Form validation on client
   ↓
4. Order saved to Firebase Firestore
   ↓
5. Order saved locally (backup)
   ↓
6. Fetch sent to: http://localhost:5000/api/send-order-emails
   ↓
7. Server generates HTML emails
   ↓
8. Email 1: Sent to customer (Confirmation)
   ↓
9. Email 2: Sent to owner (Notification)
   ↓
10. Success message shown to user
    ↓
11. Redirect to home page after 3 seconds
```

---

## ✅ Complete Testing Checklist

After setup, verify:

- [ ] `npm install` completed successfully
- [ ] Both servers started without errors
- [ ] Website loads at `http://localhost:8000`
- [ ] Can add products to cart
- [ ] Can access checkout page
- [ ] Form validates correctly
- [ ] Order placement completes
- [ ] Server console shows "Order emails sent successfully"
- [ ] Customer received confirmation email
- [ ] Owner received notification email
- [ ] Emails contain correct order details
- [ ] Firebase Firestore has the order record

---

## 🎯 Production Deployment

When deploying to production:

**1. Update server URL in checkout.js (line ~415):**
```javascript
const serverURL = 'https://your-production-domain.com';
```

**2. Deploy Node.js server to hosting:**
- Heroku
- AWS EC2
- DigitalOcean
- Replit
- etc.

**3. Update .env on production server:**
```env
PORT=5000
GMAIL_USER=theiconique79@gmail.com
GMAIL_PASS=tmwi fiao utqm qdus
OWNER_EMAIL=faheemofficial1515@gmail.com
```

**4. Update CORS in server.js for production domain:**
```javascript
app.use(cors({
  origin: 'https://your-production-domain.com'
}));
```

---

## 📞 Quick Reference

### Start Email Server
```powershell
cd "e:\Website-Project-Iconique"
npm start
```

### Start Website Server
```powershell
cd "e:\Website-Project-Iconique"
npx http-server -p 8000
```

### Test Email API
```powershell
curl http://localhost:5000/api/health
```

### Access Website
```
http://localhost:8000
```

### Access Checkout
```
http://localhost:8000/checkout/checkout.html
```

### Check Firestore Orders
```
https://console.firebase.google.com/project/the-iconique/firestore
```

---

## 🎉 You're All Set!

The email system is fully integrated and ready to use. Every order placed will automatically:
1. ✅ Save to Firestore
2. ✅ Save locally for backup
3. ✅ Send confirmation to customer
4. ✅ Send notification to owner

**Happy selling! 🛍️**

---

**Questions? Check:**
- EMAIL_SETUP_GUIDE.md - Detailed technical guide
- QUICK_START_EMAIL.md - Quick reference
- server.js - Backend code with comments
