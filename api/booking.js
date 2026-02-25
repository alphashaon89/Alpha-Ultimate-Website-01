/**
 * /api/booking — handles booking submissions
 *
 * Email delivery strategy:
 *  1. Resend (if RESEND_API_KEY is set) ← recommended
 *  2. SendGrid (if SENDGRID_API_KEY is set)
 *  3. Logs only (development fallback)
 *
 * Required env vars:
 *  - RESEND_API_KEY         → get from resend.com
 *  - CONTACT_EMAIL          → where to receive bookings (e.g. info@alpha-ultimate.com)
 *  - FROM_EMAIL             → verified sender email (e.g. noreply@alpha-ultimate.com)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, phone, email, service, date, time, homeType, city, notes } = req.body || {};

  if (!name?.trim() || !phone?.trim()) {
    return res.status(400).json({ message: 'Name and phone number are required.' });
  }

  const bookingId = 'ALF-' + Date.now().toString(36).toUpperCase();
  const timestamp = new Date().toISOString();

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 8px;">
      <div style="background: linear-gradient(135deg, #14f195, #0ea572); padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: #070712; margin: 0; font-size: 24px;">📋 New Booking — ${bookingId}</h1>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 40%; color: #666;">Booking ID</td><td style="padding: 8px 0; color: #333;">${bookingId}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Name</td><td style="padding: 8px 0; color: #333;">${name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Phone</td><td style="padding: 8px 0; color: #333;">${phone}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Email</td><td style="padding: 8px 0; color: #333;">${email || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Service</td><td style="padding: 8px 0; color: #333;">${service || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Preferred Date</td><td style="padding: 8px 0; color: #333;">${date || 'Flexible'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Preferred Time</td><td style="padding: 8px 0; color: #333;">${time || 'Flexible'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Property Type</td><td style="padding: 8px 0; color: #333;">${homeType || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">City</td><td style="padding: 8px 0; color: #333;">${city || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Notes</td><td style="padding: 8px 0; color: #333;">${notes || 'None'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Submitted At</td><td style="padding: 8px 0; color: #333;">${timestamp}</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 12px; background: #e8f5e9; border-radius: 6px; text-align: center;">
          <a href="https://wa.me/${phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(name)}%2C%20thank%20you%20for%20booking%20with%20Alpha%20Ultimate%21%20Your%20booking%20ID%20is%20${bookingId}.%20We%20will%20confirm%20your%20appointment%20shortly." 
             style="background: #25D366; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            📱 Reply via WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;

  const clientHtml = email ? `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 8px;">
      <div style="background: linear-gradient(135deg, #14f195, #0ea572); padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: #070712; margin: 0; font-size: 22px;">✅ Booking Received — Alpha Ultimate</h1>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px;">
        <p style="color: #333;">Dear <strong>${name}</strong>,</p>
        <p style="color: #555;">Thank you for choosing Alpha Ultimate! We have received your booking request and our team will contact you within 1-2 hours to confirm your appointment.</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0; color: #333;"><strong>Booking ID:</strong> ${bookingId}</p>
          <p style="margin: 4px 0; color: #333;"><strong>Service:</strong> ${service || 'To be confirmed'}</p>
          <p style="margin: 4px 0; color: #333;"><strong>Date:</strong> ${date || 'Flexible'}</p>
        </div>
        <p style="color: #555;">If you have any urgent questions, you can also reach us directly:</p>
        <p style="text-align: center;">
          <a href="https://wa.me/966563906822" style="background: #25D366; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">WhatsApp: +966 56 3906822</a>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 24px; text-align: center;">Alpha Ultimate Ltd. — Riyadh, Saudi Arabia</p>
      </div>
    </div>
  ` : null;

  console.log('[Booking]', { bookingId, name, phone, service, date, timestamp });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
  const TO = process.env.CONTACT_EMAIL || 'info@alpha-ultimate.com';
  const FROM = process.env.FROM_EMAIL || 'noreply@alpha-ultimate.com';

  let emailSent = false;

  if (RESEND_KEY) {
    try {
      const emails = [
        {
          from: `Alpha Ultimate Bookings <${FROM}>`,
          to: [TO],
          subject: `[${bookingId}] New Booking — ${name} — ${service || 'Service TBC'}`,
          html: adminHtml,
        },
      ];
      if (clientHtml && email) {
        emails.push({
          from: `Alpha Ultimate <${FROM}>`,
          to: [email],
          subject: `Booking Confirmed — ${bookingId} — Alpha Ultimate`,
          html: clientHtml,
        });
      }
      for (const payload of emails) {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_KEY}` },
          body: JSON.stringify(payload),
        });
        if (!r.ok) {
          const err = await r.text();
          console.error('[Booking] Resend error:', err);
        }
      }
      emailSent = true;
    } catch (err) {
      console.error('[Booking] Resend failed:', err);
    }
  } else if (SENDGRID_KEY) {
    try {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SENDGRID_KEY}` },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: TO }] }],
          from: { email: FROM, name: 'Alpha Ultimate Bookings' },
          subject: `[${bookingId}] New Booking — ${name}`,
          content: [{ type: 'text/html', value: adminHtml }],
        }),
      });
      emailSent = true;
    } catch (err) {
      console.error('[Booking] SendGrid failed:', err);
    }
  }

  return res.status(200).json({
    success: true,
    bookingId,
    message: 'Booking request received. We will contact you shortly to confirm.',
    emailSent,
    ...(!emailSent && !RESEND_KEY && !SENDGRID_KEY ? {
      note: 'Email delivery not configured. Set RESEND_API_KEY (resend.com) or SENDGRID_API_KEY in your env vars.',
    } : {}),
  });
}
