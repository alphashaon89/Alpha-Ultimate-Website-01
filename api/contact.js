/**
 * /api/contact — handles contact form submissions
 *
 * Requires: RESEND_API_KEY or SENDGRID_API_KEY + CONTACT_EMAIL + FROM_EMAIL
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, phone, message, subject } = req.body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  const timestamp = new Date().toISOString();
  const refId = 'MSG-' + Date.now().toString(36).toUpperCase();

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 8px;">
      <div style="background: linear-gradient(135deg, #14f195, #0ea572); padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: #070712; margin: 0; font-size: 22px;">📬 New Contact Message</h1>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 35%; color: #666;">Reference</td><td style="padding: 8px 0; color: #333;">${refId}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Name</td><td style="padding: 8px 0; color: #333;">${name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #14f195;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Phone</td><td style="padding: 8px 0; color: #333;">${phone}</td></tr>` : ''}
          ${subject ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Subject</td><td style="padding: 8px 0; color: #333;">${subject}</td></tr>` : ''}
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Received</td><td style="padding: 8px 0; color: #333;">${timestamp}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-left: 4px solid #14f195; border-radius: 0 6px 6px 0;">
          <p style="margin: 0; font-weight: bold; color: #333; margin-bottom: 8px;">Message:</p>
          <p style="margin: 0; color: #555; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="text-align: center; margin-top: 20px;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your enquiry — Alpha Ultimate')}" 
             style="background: #14f195; color: #070712; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            ✉️ Reply to ${name}
          </a>
        </p>
      </div>
    </div>
  `;

  const clientHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 8px;">
      <div style="background: linear-gradient(135deg, #14f195, #0ea572); padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: #070712; margin: 0; font-size: 22px;">Thank You for Reaching Out</h1>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px;">
        <p style="color: #333;">Dear <strong>${name}</strong>,</p>
        <p style="color: #555;">We have received your message and will get back to you within 24 hours.</p>
        <p style="color: #555;">If your enquiry is urgent, please contact us directly:</p>
        <p style="text-align: center;">
          <a href="https://wa.me/966563906822" style="background: #25D366; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">WhatsApp: +966 56 3906822</a>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 24px; text-align: center;">Reference: ${refId} | Alpha Ultimate Ltd., Riyadh, KSA</p>
      </div>
    </div>
  `;

  console.log('[Contact]', { refId, name, email, timestamp });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
  const TO = process.env.CONTACT_EMAIL || 'info@alpha-ultimate.com';
  const FROM = process.env.FROM_EMAIL || 'noreply@alpha-ultimate.com';

  let emailSent = false;

  if (RESEND_KEY) {
    try {
      const emailPayloads = [
        {
          from: `Alpha Ultimate Contact <${FROM}>`,
          to: [TO],
          reply_to: email,
          subject: `Contact: ${subject || message.substring(0, 50)} — ${name}`,
          html: adminHtml,
        },
        {
          from: `Alpha Ultimate <${FROM}>`,
          to: [email],
          subject: 'We received your message — Alpha Ultimate',
          html: clientHtml,
        },
      ];
      for (const payload of emailPayloads) {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_KEY}` },
          body: JSON.stringify(payload),
        });
        if (!r.ok) console.error('[Contact] Resend error:', await r.text());
      }
      emailSent = true;
    } catch (err) {
      console.error('[Contact] Resend failed:', err);
    }
  } else if (SENDGRID_KEY) {
    try {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SENDGRID_KEY}` },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: TO }] }],
          from: { email: FROM, name: 'Alpha Ultimate Contact' },
          reply_to: { email, name },
          subject: `Contact: ${subject || name}`,
          content: [{ type: 'text/html', value: adminHtml }],
        }),
      });
      emailSent = true;
    } catch (err) {
      console.error('[Contact] SendGrid failed:', err);
    }
  }

  return res.status(200).json({
    success: true,
    refId,
    message: 'Message received. We will get back to you within 24 hours.',
    emailSent,
  });
}
