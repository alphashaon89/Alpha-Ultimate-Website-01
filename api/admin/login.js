import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { username, password } = req.body || {};

  // Server-side env vars (no VITE_ prefix needed for API routes)
  const ADMIN_USER = process.env.ADMIN_USER || process.env.VITE_ADMIN_USER;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;
  const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production_please';

  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    return res.status(500).json({ message: 'Admin credentials not configured. Please set ADMIN_USER and ADMIN_PASSWORD env vars.' });
  }

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials.' });
}
