const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ========================================
// GMAIL TRANSPORTER CONFIGURATION
// ========================================

const GMAIL_USER = process.env.GMAIL_USER || "theiconique79@gmail.com";
const GMAIL_PASS = process.env.GMAIL_PASS || "tmwi fiao utqm qdus";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "faheemofficial1515@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS // App password from Gmail
  }
});

// Test transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready");
  }
});

// ========================================
// EMAIL TEMPLATES
// ========================================

function generateCustomerEmailHTML(order) {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">Qty: ${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">Rs. ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - The Iconique</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 2px;
        }
        .content {
          padding: 30px 20px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 14px;
          color: #667eea;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
          font-weight: 600;
        }
        .order-id {
          background-color: #f0f4ff;
          padding: 15px;
          border-left: 4px solid #667eea;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        .order-id p {
          margin: 5px 0;
          font-size: 14px;
        }
        .order-id strong {
          color: #667eea;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        table th {
          background-color: #f5f5f5;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #e0e0e0;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .summary-row.total {
          padding: 15px 0;
          font-size: 18px;
          font-weight: 600;
          color: #667eea;
          border-bottom: none;
          border-top: 2px solid #667eea;
        }
        .shipping-info {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          font-size: 14px;
        }
        .shipping-info p {
          margin: 5px 0;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #e0e0e0;
        }
        .btn {
          display: inline-block;
          background-color: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 15px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>The Iconique.</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;">ORDER CONFIRMATION</p>
        </div>
        
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 25px;">
            Hi <strong>${order.firstName} ${order.lastName}</strong>,
          </p>
          
          <p style="color: #666; margin-bottom: 25px;">
            Thank you for your order! We're preparing your items and will ship them out soon. Below is a summary of your order.
          </p>

          <!-- Order Details -->
          <div class="section">
            <div class="section-title">Order Details</div>
            <div class="order-id">
              <p><strong>Order ID:</strong> ${order.orderId}</p>
              <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Status:</strong> <span style="color: #667eea; font-weight: 600;">PENDING</span></p>
            </div>
          </div>

          <!-- Items Table -->
          <div class="section">
            <div class="section-title">Order Items</div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>

          <!-- Order Summary -->
          <div class="section">
            <div class="section-title">Order Summary</div>
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>Rs. ${order.subtotal.toFixed(2)}</span>
            </div>
            ${
              order.discount > 0
                ? `<div class="summary-row">
              <span>Discount:</span>
              <span style="color: #4caf50;">-Rs. ${order.discount.toFixed(2)}</span>
            </div>`
                : ''
            }
            <div class="summary-row">
              <span>Shipping:</span>
              <span>${order.shipping === 0 ? 'FREE' : 'Rs. ' + order.shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
              <span>Total Amount:</span>
              <span>Rs. ${order.total.toFixed(2)}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="section">
            <div class="section-title">Shipping Address</div>
            <div class="shipping-info">
              <p><strong>${order.firstName} ${order.lastName}</strong></p>
              <p>${order.address}${order.apartment ? ', ' + order.apartment : ''}</p>
              <p>${order.city}, ${order.postalCode}</p>
              <p>${order.country}</p>
              <p>Phone: ${order.phone}</p>
              <p>Email: ${order.email}</p>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="section">
            <div class="section-title">Payment Method</div>
            <p>Cash on Delivery</p>
          </div>

          <p style="color: #666; margin-top: 30px; font-size: 14px;">
            If you have any questions about your order, please reply to this email or contact us at <strong>customercare@organiclapbk.com</strong>
          </p>
        </div>

        <div class="footer">
          <p>&copy; 2025 The Iconique. All rights reserved.</p>
          <p>Premium cosmetic products for the modern woman.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOwnerEmailHTML(order) {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">Qty: ${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">Rs. ${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order - The Iconique</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 700px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 2px;
        }
        .alert {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px 20px;
          color: #856404;
        }
        .content {
          padding: 30px 20px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 14px;
          color: #1a1a1a;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
          font-weight: 600;
        }
        .order-id {
          background-color: #f0f0f0;
          padding: 15px;
          border-left: 4px solid #1a1a1a;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        .order-id p {
          margin: 5px 0;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        table th {
          background-color: #f5f5f5;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #e0e0e0;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .summary-row.total {
          padding: 15px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          border-bottom: none;
          border-top: 2px solid #1a1a1a;
        }
        .customer-info {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          font-size: 14px;
        }
        .customer-info p {
          margin: 5px 0;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #e0e0e0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>The Iconique.</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;">NEW ORDER RECEIVED</p>
        </div>
        
        <div class="alert">
          <strong>⚠️ New Order Alert:</strong> A customer has placed an order. Please review and prepare for fulfillment.
        </div>
        
        <div class="content">
          <!-- Order Details -->
          <div class="section">
            <div class="section-title">Order Details</div>
            <div class="order-id">
              <p><strong>Order ID:</strong> ${order.orderId}</p>
              <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p><strong>Status:</strong> <span style="color: #ffc107; font-weight: 600;">PENDING FULFILLMENT</span></p>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="customer-info">
              <p><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
              <p><strong>Email:</strong> ${order.email}</p>
              <p><strong>Phone:</strong> ${order.phone}</p>
            </div>
          </div>

          <!-- Items Ordered -->
          <div class="section">
            <div class="section-title">Items Ordered</div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>

          <!-- Order Total -->
          <div class="section">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>Rs. ${order.subtotal.toFixed(2)}</span>
            </div>
            ${
              order.discount > 0
                ? `<div class="summary-row">
              <span>Discount Applied:</span>
              <span style="color: #4caf50;">-Rs. ${order.discount.toFixed(2)}</span>
            </div>`
                : ''
            }
            <div class="summary-row">
              <span>Shipping:</span>
              <span>${order.shipping === 0 ? 'FREE' : 'Rs. ' + order.shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
              <span>Total Amount:</span>
              <span>Rs. ${order.total.toFixed(2)}</span>
            </div>
          </div>

          <!-- Delivery Address -->
          <div class="section">
            <div class="section-title">Delivery Address</div>
            <div class="customer-info">
              <p><strong>${order.firstName} ${order.lastName}</strong></p>
              <p>${order.address}${order.apartment ? ', ' + order.apartment : ''}</p>
              <p>${order.city}, ${order.postalCode}</p>
              <p>${order.country}</p>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="section">
            <div class="section-title">Payment Information</div>
            <p><strong>Payment Method:</strong> Cash on Delivery</p>
            <p><strong>Amount to Collect:</strong> Rs. ${order.total.toFixed(2)}</p>
          </div>
        </div>

        <div class="footer">
          <p>&copy; 2025 The Iconique. All rights reserved.</p>
          <p>Premium cosmetic products for the modern woman.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ========================================
// API ENDPOINT - SEND ORDER EMAILS
// ========================================

app.post("/api/send-order-emails", async (req, res) => {
  try {
    const order = req.body;

    // Validate required fields
    if (!order || !order.email || !order.firstName || !order.items) {
      return res.status(400).json({
        success: false,
        message: "Missing required order information"
      });
    }

    // Send customer confirmation email
    const customerEmail = {
      from: GMAIL_USER,
      to: order.email,
      subject: `Order Confirmation - The Iconique (Order #${order.orderId})`,
      html: generateCustomerEmailHTML(order)
    };

    // Send owner notification email
    const ownerEmail = {
      from: GMAIL_USER,
      to: OWNER_EMAIL,
      subject: `New Order Received - The Iconique (Order #${order.orderId})`,
      html: generateOwnerEmailHTML(order),
      cc: GMAIL_USER // CC to main email
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(customerEmail),
      transporter.sendMail(ownerEmail)
    ]);

    console.log(`✅ Order emails sent successfully for Order ID: ${order.orderId}`);

    res.status(200).json({
      success: true,
      message: "Order confirmation emails sent successfully!",
      orderId: order.orderId
    });

  } catch (error) {
    console.error("❌ Error sending emails:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send order emails",
      error: error.message
    });
  }
});

// ========================================
// HEALTH CHECK ENDPOINT
// ========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "Server is running",
    service: "The Iconique Order Email Service",
    timestamp: new Date().toISOString()
  });
});

// ========================================
// ERROR HANDLING
// ========================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Server error occurred",
    error: err.message
  });
});

// ========================================
// START SERVER
// ========================================

// For Vercel serverless functions, export the app
module.exports = app;

// For local development, start the server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n✅ Server is running on http://localhost:${PORT}`);
    console.log(`📧 Email Service: The Iconique Order Notifications`);
    console.log(`📬 Sender Email: ${GMAIL_USER}`);
    console.log(`\nServer started at ${new Date().toLocaleString()}\n`);
  });
}
