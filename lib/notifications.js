// BizBein Innovations Pvt. Ltd. — Notification Service (Resend Email & WhatsApp)
// Keeps all API credentials strictly server-side.
// Designed with error resilience so order placement is never blocked by provider downtimes.

export async function sendOrderNotifications(order) {
  const results = {
    customerEmail: 'not_configured',
    adminEmail: 'not_configured',
    adminWhatsApp: 'not_configured'
  };

  // 1. RESEND EMAIL NOTIFICATIONS
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'orders@bizbein.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'BizBein Innovations <onboarding@resend.dev>';

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
  } else {
    console.info('[Notifications] RESEND_API_KEY not configured. Skipping email dispatch.');
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
