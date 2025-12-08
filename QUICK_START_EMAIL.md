# 🚀 Quick Start Guide - Email System

## First Time Setup (5 minutes)

### 1️⃣ Install Dependencies
```powershell
cd "e:\Website-Project-Iconique"
npm install
```

Wait for installation to complete. You should see:
```
added XX packages
```

---

## Running the System

### 2️⃣ Open Terminal 1: Start Email Server
```powershell
cd "e:\Website-Project-Iconique"
npm start
```

**Expected Output:**
```
✅ Server is running on http://localhost:5000
📧 Email Service: The Iconique Order Notifications
📬 Sender Email: theiconique79@gmail.com
```

✅ **Keep this terminal open!**

---

### 3️⃣ Open Terminal 2: Start Website Server
```powershell
cd "e:\Website-Project-Iconique"
npx http-server -p 8000
```

**Expected Output:**
```
Starting up http-server, serving ./public
Available on:
  http://127.0.0.1:8000
```

✅ **Keep this terminal open!**

---

## Testing

### 4️⃣ Test the System
1. Go to: **http://localhost:8000**
2. Add products to cart
3. Go to checkout: **http://localhost:8000/checkout/checkout.html**
4. Fill in order form with:
   - Name: Test User
   - Email: **Your email address**
   - Phone: 03260720251
   - Address: Test Address
   - City: Karachi
   - Country: Pakistan
5. Check "Agree to Terms"
6. Click "Complete Order"

### 5️⃣ Check Your Email
- Look in your **inbox** for order confirmation
- Check **faheemofficial1515@gmail.com** for owner notification
- Check **spam/junk** folder if not found

---

## 📋 Credentials

| Item | Details |
|------|---------|
| Sender Email | theiconique79@gmail.com |
| App Password | tmwi fiao utqm qdus |
| Owner Email | faheemofficial1515@gmail.com |
| Server Port | 5000 |
| Website Port | 8000 |

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| "Connection refused" | Email server not running (Terminal 1) |
| "Checkout page not loading" | Website server not running (Terminal 2) |
| "Email not received" | Check spam folder, verify email in form |
| "Port already in use" | Close other apps using port 5000 or 8000 |

---

## 📧 Email Details

**Customer gets:**
- Order confirmation with all details
- Product list with prices
- Shipping address
- Order tracking info

**Owner gets:**
- New order alert
- Customer contact info
- Complete order details
- Amount to collect

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Start both servers
3. ✅ Test with sample order
4. ✅ Verify emails work
5. ✅ Ready for production!

---

**For detailed setup, see: EMAIL_SETUP_GUIDE.md**
