import { companyDetails } from '../data/products';

export const WHATSAPP_RAW_NUMBER = companyDetails.whatsappRaw || '919915856540';

export function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_RAW_NUMBER}?text=${encodeURIComponent(message.trim())}`;
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return url;
}

export function formatContactInquiry({ name, phone, company, email, message }) {
  return [
    `*BizBein Innovations — Contact Page Inquiry*`,
    `----------------------------------------`,
    `👤 *Name:* ${name || 'N/A'}`,
    phone ? `📱 *Phone / WhatsApp:* ${phone}` : null,
    company ? `🏢 *Company / Factory:* ${company}` : null,
    `✉️ *Email:* ${email || 'N/A'}`,
    `📝 *Requirement / Machinery Specs:*`,
    message || 'No additional details provided.'
  ].filter(Boolean).join('\n');
}

export function formatProductRfq({ product, quantity, companyName, contactPerson, phone, email, pincode, notes }) {
  return [
    `*BizBein Innovations — RFQ Machinery Inquiry*`,
    `----------------------------------------`,
    `⚙️ *Product:* ${product?.name || 'Equipment'}`,
    product?.model ? `🏷️ *Model / Code:* ${product.model}` : null,
    product?.priceDisplay ? `💰 *Listed Base:* ${product.priceDisplay}` : null,
    `📦 *Requested Quantity:* ${quantity || 1}`,
    `----------------------------------------`,
    `🏢 *Company / Factory:* ${companyName || 'N/A'}`,
    `👤 *Contact Person:* ${contactPerson || 'N/A'}`,
    `📱 *Phone / WhatsApp:* ${phone || 'N/A'}`,
    `✉️ *Email:* ${email || 'N/A'}`,
    pincode ? `📍 *Location / Pincode:* ${pincode}` : null,
    notes ? `📝 *Application Notes:* ${notes}` : null
  ].filter(Boolean).join('\n');
}

export function formatCartInquiry(items = [], total = 0) {
  const itemList = items
    .map((item, idx) => `${idx + 1}. *${item.name}* (${item.model || 'Standard'}) — Qty: ${item.qty || 1}${item.priceDisplay ? ` [${item.priceDisplay}]` : ''}`)
    .join('\n');

  return [
    `*BizBein Innovations — Equipment Cart Inquiry*`,
    `----------------------------------------`,
    `Hello BizBein Technical Sales, please provide commercial pricing, lead time, and specifications for:`,
    '',
    itemList,
    '',
    total ? `💰 *Estimated Total:* ₹${total.toLocaleString('en-IN')}` : null,
    `----------------------------------------`,
    `Please advise on freight dispatch and commissioning terms.`
  ].filter(Boolean).join('\n');
}

export function formatExpertCallRequest({ name, phone, topic }) {
  return [
    `*BizBein Innovations — Technical Consultation Request*`,
    `----------------------------------------`,
    `👤 *Name:* ${name || 'N/A'}`,
    `📱 *Phone:* ${phone || 'N/A'}`,
    `🔧 *Consultation Topic:* ${topic || 'Industrial Machinery'}`,
    `----------------------------------------`,
    `I would like to speak directly with a BizBein machinery application engineer.`
  ].join('\n');
}

export function formatOrderInquiry(order) {
  return [
    `*BizBein Innovations — Order Follow-up*`,
    `----------------------------------------`,
    `📋 *Order ID:* #${order.orderId}`,
    `👤 *Customer:* ${order.customerName || order.shippingAddress?.fullName}`,
    `💰 *Amount:* ₹${(order.totalAmount || 0).toLocaleString('en-IN')}`,
    `📦 *Items:* ${order.items?.map((i) => `${i.name} (x${i.qty})`).join(', ')}`,
    `----------------------------------------`,
    `Please provide status on dispatch and proforma invoice clearance.`
  ].join('\n');
}
