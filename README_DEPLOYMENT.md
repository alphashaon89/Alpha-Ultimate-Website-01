# Alpha Ultimate — Production Deployment Guide

## 🚀 Quick Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial production commit"
gh repo create alpha-ultimate --private --push
```

### 2. Deploy on Vercel
- Visit https://vercel.com → New Project → Import your repo
- Framework: **Vite** (auto-detected)
- Root Directory: `.` (project root)

### 3. Configure Environment Variables
In Vercel Dashboard → Project → Settings → Environment Variables, add:

| Variable | Value | Required |
|---|---|---|
| `ADMIN_USER` | Your admin username | ✅ |
| `ADMIN_PASSWORD` | Strong password | ✅ |
| `JWT_SECRET` | 64-char random hex | ✅ |
| `VITE_GEMINI_API_KEY` | From aistudio.google.com | ✅ for Yusra |
| `RESEND_API_KEY` | From resend.com | ✅ for emails |
| `CONTACT_EMAIL` | Where bookings go | ✅ for emails |
| `FROM_EMAIL` | Verified sender email | ✅ for emails |

### 4. Enable Content Persistence (Admin Panel)
1. Vercel Dashboard → Project → **Storage** tab
2. Click **Create** → **KV Database** → Create + Link to project
3. KV env vars are auto-set. Redeploy.

### 5. Enable Media Uploads (Admin Panel)
**Option A — Vercel Blob (easiest):**
1. Vercel Dashboard → Project → **Storage** → **Blob** → Create + Link
2. `BLOB_READ_WRITE_TOKEN` is auto-set. Redeploy.

**Option B — Cloudinary:**
1. Create free account at cloudinary.com
2. Add `CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name`

---

## 🔧 Local Development
```bash
npm install
cp .env.example .env.local
# Fill in your .env.local values
npm run dev
```

## 🌐 Admin Panel
- URL: `/admin/login`
- Username & password from your `ADMIN_USER` / `ADMIN_PASSWORD` env vars

## 💬 Yusra AI Assistant
- Powered by Google Gemini 2.0 Flash
- Requires `VITE_GEMINI_API_KEY`
- Supports English, Arabic, and Bangla
- Access gate: name must contain 'W', number must contain '181989'

## 📧 Email Setup
Uses Resend (recommended) or SendGrid:
- Sign up at resend.com → get API key → add `RESEND_API_KEY`
- Verify your sending domain in Resend dashboard
- Set `FROM_EMAIL` to your verified domain email

## 📱 Mobile Notes
- Fully responsive with safe-area insets for iOS
- Video poster fallback if autoplay is blocked
- Touch targets meet 44px WCAG minimum
- iOS zoom-on-focus prevention (inputs use 16px min)
