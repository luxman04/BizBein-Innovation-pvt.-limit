// BizBein Innovations Pvt. Ltd. — Notification Service (Resend Email, SMTP / Gmail & WhatsApp)
// Keeps all API credentials strictly server-side.
// Designed with error resilience so order placement is never blocked by provider downtimes.

import nodemailer from 'nodemailer';

function getSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER || process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  if (!user || !pass) return null;

  try {
    if (host) {
      return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });
    }

    if (user.endsWith('@gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
    }
  } catch (err) {
    console.warn('[SMTP] Could not initialize transporter:', err.message);
  }

  return null;
}

export async function sendOrderNotifications(order) {
  const results = {
    customerEmail: 'not_configured',
    adminEmail: 'not_configured',
    adminWhatsApp: 'not_configured'
  };

  // 1. EMAIL NOTIFICATIONS (Resend or SMTP)
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'orders@bizbein.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'BizBein Innovations <onboarding@resend.dev>';
  const smtpTransporter = getSmtpTransporter();

  if (resendApiKey) {
    // Send Customer Order Confirmation Email
    try {
      const customerEmailHtml = generateCustomerOrderHtml(order);
      const custRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [order.customerEmail],
          subject: `Order Confirmed: ${order.orderId} — BizBein Innovations Pvt. Ltd.`,
          html: customerEmailHtml
        })
      });

      if (custRes.ok) {
        results.customerEmail = 'sent';
      } else {
        const errorText = await custRes.text();
        console.warn('[Resend] Customer email delivery notice:', errorText);
        results.customerEmail = 'failed';
      }
    } catch (err) {
      console.error('[Resend] Error sending customer email:', err.message);
      results.customerEmail = 'failed';
    }

    // Send Admin New-Order Email Notification
    try {
      const adminEmailHtml = generateAdminOrderHtml(order);
      const adminRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [adminEmail],
          subject: `[NEW ORDER] ${order.orderId} — ₹${order.total.toLocaleString('en-IN')} by ${order.customerName}`,
          html: adminEmailHtml
        })
      });

      if (adminRes.ok) {
        results.adminEmail = 'sent';
      } else {
        const errText = await adminRes.text();
        console.warn('[Resend] Admin email notice:', errText);
        results.adminEmail = 'failed';
      }
    } catch (err) {
      console.error('[Resend] Error sending admin email:', err.message);
      results.adminEmail = 'failed';
    }
  } else if (smtpTransporter) {
    const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.SMTP_EMAIL || fromEmail;
    try {
      await smtpTransporter.sendMail({
        from: smtpFrom,
        to: order.customerEmail,
        subject: `Order Confirmed: ${order.orderId} — BizBein Innovations Pvt. Ltd.`,
        html: generateCustomerOrderHtml(order)
      });
      results.customerEmail = 'sent';
    } catch (e) {
      console.warn('[SMTP] Customer order email error:', e.message);
      results.customerEmail = 'failed';
    }

    try {
      await smtpTransporter.sendMail({
        from: smtpFrom,
        to: adminEmail,
        subject: `[NEW ORDER] ${order.orderId} — ₹${order.total.toLocaleString('en-IN')} by ${order.customerName}`,
        html: generateAdminOrderHtml(order)
      });
      results.adminEmail = 'sent';
    } catch (e) {
      console.warn('[SMTP] Admin order email error:', e.message);
      results.adminEmail = 'failed';
    }
  } else {
    console.info('[Notifications] Neither RESEND_API_KEY nor SMTP configured. Skipping email dispatch.');
  }

  // 2. WHATSAPP NOTIFICATIONS
  // Supports WhatsApp Business Cloud API
  const whatsappToken = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const adminWhatsAppNumber = process.env.ADMIN_WHATSAPP_NUMBER || '+919915856540';

  if (whatsappToken && phoneNumberId) {
    try {
      const messageBody = formatWhatsAppOrderMessage(order);
      const cleanToNumber = adminWhatsAppNumber.replace(/[^0-9]/g, '');

      const waRes = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${whatsappToken}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanToNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: messageBody
          }
        })
      });

      if (waRes.ok) {
        results.adminWhatsApp = 'sent';
      } else {
        const waErr = await waRes.text();
        console.warn('[WhatsApp] API delivery notice:', waErr);
        results.adminWhatsApp = 'failed';
      }
    } catch (err) {
      console.error('[WhatsApp] Delivery error:', err.message);
      results.adminWhatsApp = 'failed';
    }
  } else {
    console.info('[Notifications] WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID not configured.');
  }

  return results;
}

// ----------------- EMAIL TEMPLATE GENERATORS -----------------

function generateCustomerOrderHtml(order) {
  const itemsRows = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 8px; font-weight: 600; color: #1e293b;">${item.name}</td>
        <td style="padding: 12px 8px; text-align: center; color: #475569;">${item.qty}</td>
        <td style="padding: 12px 8px; text-align: right; color: #475569;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #1e293b;">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
        <table style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; border-collapse: collapse; width: 100%;">
          <!-- Header -->
          <tr style="background: #13192B;">
            <td style="padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.05em;">BIZ BEIN INNOVATIONS</h1>
              <span style="color: #F8B50E; font-size: 11px; font-weight: 700; text-transform: uppercase;">Industrial Conveying, Coding & Packaging Equipment</span>
            </td>
          </tr>

          <!-- Banner -->
          <tr style="background: #fef7ea; border-bottom: 2px solid #F8B50E;">
            <td style="padding: 18px 24px;">
              <h2 style="color: #b45309; margin: 0 0 6px 0; font-size: 18px;">Thank You for Your Order!</h2>
              <p style="margin: 0; color: #78350f; font-size: 13.5px;">Your order has been recorded and received by our factory operations desk.</p>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding: 24px;">
              <table style="width: 100%; margin-bottom: 20px; font-size: 13.5px;">
                <tr>
                  <td style="padding-bottom: 6px;"><strong>Order ID:</strong> <span style="color: #1e293b; font-family: monospace;">${order.orderId}</span></td>
                  <td style="padding-bottom: 6px; text-align: right;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding-bottom: 6px;"><strong>Payment Method:</strong> ${order.paymentMethod}</td>
                  <td style="padding-bottom: 6px; text-align: right;"><strong>Payment Status:</strong> <span style="background: #dcfce7; color: #15803D; padding: 2px 8px; border-radius: 4px; font-weight: 700;">${order.paymentStatus}</span></td>
                </tr>
              </table>

              <!-- Products Table -->
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; margin-bottom: 20px;">
                <thead>
                  <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left; font-size: 12px; text-transform: uppercase; color: #475569;">
                    <th style="padding: 10px 8px;">Product</th>
                    <th style="padding: 10px 8px; text-align: center;">Qty</th>
                    <th style="padding: 10px 8px; text-align: right;">Unit Price</th>
                    <th style="padding: 10px 8px; text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Totals -->
              <table style="width: 100%; font-size: 13.5px; margin-bottom: 24px;">
                <tr>
                  <td style="text-align: right; padding: 4px 0; color: #64748b;">Subtotal:</td>
                  <td style="text-align: right; padding: 4px 0; width: 120px; font-weight: 600;">₹${order.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="text-align: right; padding: 4px 0; color: #64748b;">GST (18% Input Tax Credit):</td>
                  <td style="text-align: right; padding: 4px 0; font-weight: 600;">₹${order.gst.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="text-align: right; padding: 4px 0; color: #64748b;">Freight / Commissioning:</td>
                  <td style="text-align: right; padding: 4px 0; font-weight: 600; color: #15803D;">FREE Factory Dispatch</td>
                </tr>
                <tr style="font-size: 16px; border-top: 2px solid #e2e8f0;">
                  <td style="text-align: right; padding: 10px 0; font-weight: 800; color: #1e293b;">Total Amount:</td>
                  <td style="text-align: right; padding: 10px 0; font-weight: 800; color: #b45309;">₹${order.total.toLocaleString('en-IN')}</td>
                </tr>
              </table>

              <!-- Delivery Address -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #475569;">Delivery Address</h4>
                <p style="margin: 0; font-size: 13.5px; line-height: 1.5;">
                  <strong>${order.shippingAddress.fullName || order.customerName}</strong><br/>
                  ${order.shippingAddress.address}<br/>
                  ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br/>
                  Phone: ${order.shippingAddress.phone || order.customerPhone}
                </p>
              </div>

              <!-- Contact Footer -->
              <p style="margin: 0; font-size: 12.5px; color: #64748b; line-height: 1.5;">
                For dispatch inquiries or machine commissioning schedules, call our technical helpline at 
                <strong>+91 99158-56540</strong> or email <strong>sales@bizbein.com</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr style="background: #f1f5f9; border-top: 1px solid #e2e8f0;">
            <td style="padding: 16px 24px; text-align: center; font-size: 11.5px; color: #64748b;">
              BizBein Innovations Pvt. Ltd. | Zirakpur, SAS Nagar, Punjab - 140603, India
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function generateAdminOrderHtml(order) {
  const itemSummary = order.items.map((i) => `${i.name} (Qty: ${i.qty})`).join(', ');

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; background: #ffffff;">
          <h2 style="color: #13192B; margin-top: 0;">⚡ New Order Placed: ${order.orderId}</h2>
          <p><strong>Customer Name:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
          <p><strong>Order Total:</strong> ₹${order.total.toLocaleString('en-IN')}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod} (${order.paymentStatus})</p>
          <p><strong>Destination:</strong> ${order.shippingAddress.city}, ${order.shippingAddress.state} (${order.shippingAddress.pincode})</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <h4>Ordered Products:</h4>
          <ul>
            ${order.items.map((i) => `<li><strong>${i.name}</strong> — Qty: ${i.qty} — ₹${(i.price * i.qty).toLocaleString('en-IN')}</li>`).join('')}
          </ul>
          <p style="margin-top: 20px;">
            <a href="https://bizbein.com/admin/orders" style="display: inline-block; background: #F8B50E; color: #0f172a; padding: 10px 18px; text-decoration: none; font-weight: 700; border-radius: 6px;">
              Open Admin Dashboard
            </a>
          </p>
        </div>
      </body>
    </html>
  `;
}

function formatWhatsAppOrderMessage(order) {
  const itemLines = order.items.map((i) => `• ${i.name} (x${i.qty})`).join('\n');

  return `🏭 *BIZBEIN INNOVATIONS — NEW ORDER ALERT*\n\n` +
    `*Order ID:* ${order.orderId}\n` +
    `*Customer:* ${order.customerName}\n` +
    `*Phone:* ${order.customerPhone}\n` +
    `*Email:* ${order.customerEmail}\n\n` +
    `*Items:*\n${itemLines}\n\n` +
    `*Total:* ₹${order.total.toLocaleString('en-IN')}\n` +
    `*Payment:* ${order.paymentMethod} (${order.paymentStatus})\n` +
    `*Delivery:* ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}\n\n` +
    `View in Admin Panel: /admin/orders`;
}

// ----------------- OTP EMAIL DISPATCH -----------------

export async function sendOtpEmail({ to, otp, purpose = 'login', userName = '' }) {
  const isRegister = purpose === 'register';
  const subject = isRegister
    ? `Verify your email: ${otp} — BizBein Innovations`
    : `Your login code: ${otp} — BizBein Innovations`;

  const html = generateOtpHtml({ otp, purpose, userName });
  const isProd = process.env.NODE_ENV === 'production';

  // 1. Try Resend API if configured
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && !resendApiKey.startsWith('re_123456789_')) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'BizBein Security <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html
        })
      });

      if (res.ok) {
        return { success: true, status: 'sent', provider: 'resend' };
      } else {
        const errText = await res.text();
        console.warn('[Resend] OTP email delivery notice:', errText);
        let parsed = {};
        try { parsed = JSON.parse(errText); } catch (e) {}
        const isSandbox = errText.includes('You can only send testing emails to your own email address');
        if (isSandbox) {
          // If Resend rejected because of sandbox restriction, fallback to SMTP or return informative restriction
          const smtpFallback = getSmtpTransporter();
          if (smtpFallback) {
            try {
              const from = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.SMTP_EMAIL || 'BizBein Security';
              await smtpFallback.sendMail({ from, to, subject, html });
              return { success: true, status: 'sent', provider: 'smtp' };
            } catch (smtpErr) {
              console.error('[SMTP fallback error]:', smtpErr.message);
            }
          }
          return {
            success: false,
            status: 'failed',
            provider: 'resend',
            isSandboxRestriction: true,
            error: parsed.message || 'Resend free sandbox allows sending only to your Resend account email.',
            plainOtp: otp
          };
        }
      }
    } catch (err) {
      console.error('[Resend] OTP delivery network error:', err.message);
    }
  }

  // 2. Try SMTP / Gmail Transporter if configured
  const smtpTransporter = getSmtpTransporter();
  if (smtpTransporter) {
    try {
      const from = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.SMTP_EMAIL || 'BizBein Security';
      await smtpTransporter.sendMail({
        from,
        to,
        subject,
        html
      });
      return { success: true, status: 'sent', provider: 'smtp' };
    } catch (err) {
      console.error('[SMTP] OTP email delivery error:', err.message);
    }
  }

  // 3. Simulated Development fallback
  console.info(`[Auth DEV] OTP dispatch for <${to}> [purpose=${purpose}]: ${otp}`);
  return { success: true, status: 'simulated', plainOtp: otp };
}

function generateOtpHtml({ otp, purpose, userName }) {
  const isRegister = purpose === 'register';
  const actionText = isRegister ? 'complete your account registration' : 'sign in to your BizBein account';

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
        <table style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; border-collapse: collapse; width: 100%; box-shadow: 0 4px 12px rgba(15,23,42,0.05);">
          <!-- Header -->
          <tr style="background: #13192B;">
            <td style="padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.05em;">BIZ BEIN INNOVATIONS</h1>
              <span style="color: #F8B50E; font-size: 11px; font-weight: 700; text-transform: uppercase;">Direct Procurement & Industrial Security Desk</span>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="color: #13192B; margin: 0 0 12px 0; font-size: 19px; font-weight: 700;">
                ${isRegister ? 'Confirm Your Registration' : 'Account Verification Code'}
              </h2>
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 14.5px; line-height: 1.5;">
                ${userName ? `Hello <strong>${userName}</strong>,<br/><br/>` : ''}
                Use the 6-digit verification code below to ${actionText}:
              </p>

              <!-- OTP Code Display -->
              <div style="background: #fef7ea; border: 2px solid #F8B50E; border-radius: 8px; padding: 18px 24px; text-align: center; margin: 24px 0;">
                <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #13192B; display: inline-block;">
                  ${otp}
                </span>
                <div style="margin-top: 8px; font-size: 12px; font-weight: 600; color: #b45309; text-transform: uppercase; letter-spacing: 0.05em;">
                  Valid for 5 minutes only • Maximum 5 attempts
                </div>
              </div>

              <!-- Security Information -->
              <div style="background: #f1f5f9; border-radius: 6px; padding: 14px 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 12.5px; color: #475569; line-height: 1.5;">
                  <strong>Security Reminder:</strong> Never share this code with anyone, including BizBein representatives. If you did not initiate this request, you can safely ignore this email.
                </p>
              </div>

              <p style="margin: 0; font-size: 12.5px; color: #64748b; line-height: 1.5;">
                Need assistance? Contact our technical desk at <strong>sales@bizbein.com</strong> or call <strong>+91 99158-56540</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr style="background: #f8fafc; border-top: 1px solid #e2e8f0;">
            <td style="padding: 16px 24px; text-align: center; font-size: 11.5px; color: #64748b;">
              BizBein Innovations Pvt. Ltd. | Zirakpur, SAS Nagar, Punjab - 140603, India
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

