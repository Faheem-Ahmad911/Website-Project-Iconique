# Email Notification System Setup Guide

## Overview
The Iconique website now has a complete email notification system that sends order confirmation emails to customers and notifies the owner of new orders.

---

## 📋 System Architecture

### Components:
1. **Frontend (Checkout Page)**: Collects order data and triggers email sending
2. **Backend (Node.js/Express Server)**: Handles email sending via Gmail
3. **Email Service**: Nodemailer with Gmail SMTP
4. **Database**: Firebase Firestore (stores orders)

### Email Flow:
```
Customer Places Order
    ↓
Order saved to Firestore + Local Storage
    ↓
Server receives order data via API
    ↓
Generates HTML email templates
    ↓
Sends 2 emails:
  - Confirmation to customer
  - Notification to owner
```

---

## 🚀 Installation & Setup

### Step 1: Install Dependencies

Open PowerShell in the project root directory and run:

```powershell
cd "e:\Website-Project-Iconique"
npm install
```

This installs:
- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **nodemailer**: Email service
- **dotenv**: Environment variables

### Step 2: Verify Files Created

Check that these files exist in your project root:
- ✅ `server.js` - Main backend server
- ✅ `.env` - Environment variables (credentials)
- ✅ `package.json` - Project dependencies

### Step 3: Start the Email Server

In a **new PowerShell terminal**, run:

```powershell
cd "e:\Website-Project-Iconique"
npm start
```

You should see:
```
✅ Server is running on http://localhost:5000
📧 Email Service: The Iconique Order Notifications
📬 Sender Email: theiconique79@gmail.com

Server started at [timestamp]
```

**Keep this terminal open!** The server must be running for emails to be sent.

### Step 4: Start the Website Server

In another **new PowerShell terminal**, run:

```powershell
cd "e:\Website-Project-Iconique"
npx http-server -p 8000
```

Access your site at: **http://localhost:8000**

---

## 📧 Email Credentials

**Gmail Account Used:**
- Email: `theiconique79@gmail.com`
- App Password: `tmwi fiao utqm qdus`

**Owner Email (Receives Orders):**
- Email: `faheemofficial1515@gmail.com`

---

## 🧪 Testing the System

### Step 1: Access the Checkout Page
Go to: `http://localhost:8000/checkout/checkout.html`

### Step 2: Add Items to Cart
Add products to your cart (or they should already be there)

### Step 3: Fill Checkout Form
Complete all required fields:
- First Name, Last Name
- Email (use your test email)
- Phone, Address, City, Country
- Agree to terms & policies

### Step 4: Place Order
Click "Complete Order"

### Step 5: Check Emails
- **Customer**: Check your test email inbox for order confirmation
- **Owner**: Check `faheemofficial1515@gmail.com` for order notification

---

## 📧 Email Templates

### Customer Email Includes:
- Order confirmation header
- Order ID and date
- Product list with quantities and prices
- Subtotal, discount, shipping, and total
- Complete shipping address
- Payment method
- Professional footer

### Owner Email Includes:
- Alert header (NEW ORDER)
- Order ID and date
- Customer information
- Complete item list
- Order total with amount to collect
- Delivery address
- Payment details

---

## 🔧 Configuration

### To Change Sender Email:
Edit `.env` file:
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

### To Change Owner Email:
Edit `server.js`, find this line (around line 160):
```javascript
to: "faheemofficial1515@gmail.com",
```
Replace with your desired email.

### To Change Server Port:
Edit `.env`:
```
PORT=5000  // Change 5000 to your desired port
```

Also update `checkout.js` (around line 390):
```javascript
const serverURL = 'http://localhost:5000'; // Update port here too
```

---

## 🚨 Troubleshooting

### Issue: "Server is not running" error
**Solution:**
- Make sure terminal running `npm start` is still open
- Ensure port 5000 is not in use by another application
- Try restarting the server

### Issue: Emails not sending
**Solution:**
1. Check `.env` file has correct credentials
2. Verify Gmail account has "Less secure app access" enabled (if not using App Password)
3. Check server console for error messages
4. Verify internet connection
5. Check spam/junk folder in email accounts

### Issue: CORS error in browser console
**Solution:**
- Ensure email server is running on port 5000
- Both servers must be running (http-server on 8000, email server on 5000)

### Issue: Emails arriving in spam
**Solution:**
- This is normal for new email addresses
- Add the email to contacts to mark as trusted
- Check spam folder to confirm delivery

---

## 📊 API Endpoints

### Health Check
```
GET http://localhost:5000/api/health
```

Returns server status

### Send Order Emails
```
POST http://localhost:5000/api/send-order-emails
Content-Type: application/json

Body: {
  orderId: "ORD-1234567890-ABC123",
  email: "customer@example.com",
  firstName: "John",
  lastName: "Doe",
  items: [...],
  subtotal: 5000,
  discount: 500,
  shipping: 250,
  total: 4750,
  address: "123 Main St",
  city: "Karachi",
  country: "Pakistan",
  phone: "+923260720251",
  ...
}
```

Response:
```json
{
  "success": true,
  "message": "Order confirmation emails sent successfully!",
  "orderId": "ORD-1234567890-ABC123"
}
```

---

## 🔐 Security Notes

1. **Never commit `.env` file** to Git (already in .gitignore if set up correctly)
2. **App Password**: Gmail's app-specific password is more secure than main password
3. **CORS**: Enabled for development (restrict in production)
4. **Error Messages**: Don't expose sensitive info in production

---

## 📝 Files Modified

1. **server.js** - Created
   - Express server with email routes
   - Nodemailer configuration
   - HTML email templates
   - Error handling

2. **.env** - Created
   - Email credentials
   - Environment configuration

3. **package.json** - Created
   - Project dependencies
   - NPM scripts

4. **checkout.js** - Modified
   - Added `sendOrderEmails()` function
   - Integrated email sending into order flow
   - Error handling for email failures

---

## 🎯 Production Deployment

When deploying to production:

1. **Update server URL** in checkout.js:
   ```javascript
   const serverURL = 'https://your-production-domain.com';
   ```

2. **Update CORS** in server.js to whitelist your domain:
   ```javascript
   app.use(cors({
     origin: 'https://your-production-domain.com'
   }));
   ```

3. **Use environment variables** for all sensitive data

4. **Enable HTTPS** for production

5. **Update email credentials** if using different account

---

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with credentials
- [ ] Email server running on port 5000
- [ ] Website server running on port 8000
- [ ] Test order placed successfully
- [ ] Customer received confirmation email
- [ ] Owner received order notification email
- [ ] Emails contain correct order details
- [ ] Email formatting looks good in email client

---

## 📞 Support

For issues:
1. Check the terminal console for error messages
2. Verify both servers are running
3. Test with `curl` or Postman if needed
4. Check spam/junk folders for emails
5. Verify Gmail credentials are correct

---

**The Iconique Order Email Service is now live! 🎉**
