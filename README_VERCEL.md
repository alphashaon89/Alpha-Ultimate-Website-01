# Alpha Ultimate — Vercel Deployment Guide

## 🚀 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/alpha-ultimate)

---

## ⚙️ Required Environment Variables

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini AI API key for Yusra assistant | ✅ |
| `VITE_API_KEY` | Same as GEMINI_API_KEY (used by Vite) | ✅ |
| `VITE_ADMIN_USER` | Admin panel username | ✅ |
| `VITE_ADMIN_PASSWORD` | Admin panel password (make it strong!) | ✅ |
| `JWT_SECRET` | Secret for JWT signing (32+ random chars) | ✅ |

### Getting a Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it as both `GEMINI_API_KEY` and `VITE_API_KEY`

---

## 📁 Project Structure

```
├── api/                    # Vercel Serverless Functions
│   ├── admin/
│   │   ├── login.js        # POST /api/admin/login
│   │   ├── content.js      # GET|POST /api/admin/content
│   │   └── yusra-icon.js   # GET|POST /api/admin/yusra-icon
│   ├── booking.js          # POST /api/booking
│   └── contact.js          # POST /api/contact
├── public/
│   ├── assets/             # Static assets (images, videos)
│   ├── content.json        # Site content (services, FAQs, testimonials)
│   ├── robots.txt          # SEO crawl rules
│   └── sitemap.xml         # SEO sitemap
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/              # Route pages
│   ├── hooks/              # Custom React hooks
│   ├── locales/            # i18n translations (EN, AR, BN)
│   └── lib/                # Utilities & validation schemas
├── vercel.json             # Vercel configuration
└── vite.config.ts          # Build configuration
```

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server  
npm run dev
# App: http://localhost:5173
# API server: http://localhost:3000
```

---

## 🌐 Features

- **Multi-language**: English 🇬🇧, Arabic 🇸🇦, Bangla 🇧🇩
- **AI Assistant**: Yusra (powered by Google Gemini 2.0 Flash)
- **Booking System**: Real-time form with map location picker
- **Price Estimator**: Dynamic pricing calculator
- **Admin Panel**: Content management with JWT auth
- **SEO Optimized**: Meta tags, sitemap, structured data
- **Performance**: Code splitting, lazy loading, image optimization

---

## 📧 Setting Up Real Email Notifications

The booking and contact forms currently log to console. To send real emails:

### Option 1: Resend (Recommended)
```bash
npm install resend
```
```js
// In api/booking.js
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'bookings@alpha-ultimate.com',
  to: 'info@alpha-ultimate.com',
  subject: `New Booking from ${name}`,
  html: `<p>${JSON.stringify(req.body)}</p>`
});
```

### Option 2: SendGrid
```bash
npm install @sendgrid/mail
```

---

## 💾 Persistent Content Storage

Admin content edits are not persisted by default (Vercel serverless is stateless).
To persist content changes:

### Option: Vercel KV (Redis)
```bash
npm install @vercel/kv
```
Add `KV_REST_API_URL` and `KV_REST_API_TOKEN` to environment variables.

### Option: Supabase (PostgreSQL)
```bash
npm install @supabase/supabase-js
```

---

## 🔒 Security Checklist

Before going live:
- [ ] Change `VITE_ADMIN_USER` from default
- [ ] Set a strong `VITE_ADMIN_PASSWORD` (12+ chars, mixed)
- [ ] Set a long random `JWT_SECRET` (use: `openssl rand -hex 32`)
- [ ] Update social media links in Footer.tsx
- [ ] Update `og:url` in index.html with real domain
- [ ] Update sitemap.xml with real domain
- [ ] Update contact email/phone in Contact.tsx if needed
