/**
 * /api/admin/content — GET/POST site content
 *
 * Storage strategy (priority order):
 *  1. Vercel KV (if KV_REST_API_URL + KV_REST_API_TOKEN are set) ← recommended
 *  2. Static public/content.json (read-only fallback for GET)
 *
 * GET  → returns current content (no auth required)
 * POST → saves content (admin auth required)
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import jwt from 'jsonwebtoken';

const CONTENT_KEY = 'alpha_ultimate_content';

function verifyToken(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'change_this_in_production_please');
  } catch {
    return null;
  }
}

function getStaticContent() {
  try {
    const p = join(process.cwd(), 'public', 'content.json');
    return JSON.parse(readFileSync(p, 'utf-8'));
  } catch {
    return {};
  }
}

const hasKV = () => !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

async function kvGet(key) {
  const res = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.result ? JSON.parse(data.result) : null;
}

async function kvSet(key, value) {
  const res = await fetch(`${process.env.KV_REST_API_URL}/set/${key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: JSON.stringify(value) }),
  });
  return res.ok;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    if (hasKV()) {
      try {
        const kvContent = await kvGet(CONTENT_KEY);
        if (kvContent && Object.keys(kvContent).length > 0) {
          return res.status(200).json(kvContent);
        }
      } catch { /* fall through to static */ }
    }
    return res.status(200).json(getStaticContent());
  }

  if (req.method === 'POST') {
    const decoded = verifyToken(req);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized. Please log in.' });

    const { content } = req.body || {};
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ message: 'Invalid content payload.' });
    }

    console.log(`[Content] Update received from: ${decoded.username}`);

    if (hasKV()) {
      try {
        const ok = await kvSet(CONTENT_KEY, content);
        if (ok) {
          return res.status(200).json({ success: true, message: 'Content saved successfully.' });
        }
        throw new Error('KV set returned not-ok');
      } catch (err) {
        console.error('[Content] KV error:', err);
        return res.status(500).json({ message: 'Failed to save: ' + err.message });
      }
    }

    // No persistent storage configured — return actionable 202
    return res.status(202).json({
      success: false,
      message: 'Content received but NOT persisted. Configure Vercel KV for persistent editing.',
      instructions: [
        '1. Vercel Dashboard → Your Project → Storage → Create KV',
        '2. Link to project (auto-sets KV_REST_API_URL + KV_REST_API_TOKEN)',
        '3. Redeploy — content edits will now persist.',
      ],
      docs: 'https://vercel.com/docs/storage/vercel-kv',
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
