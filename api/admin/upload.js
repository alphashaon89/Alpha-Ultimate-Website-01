/**
 * /api/admin/upload/[type] — handles logo, yusra-icon, gallery, graphics uploads
 *
 * ⚡ Production strategy:
 *  1. Vercel Blob (if BLOB_READ_WRITE_TOKEN is set)
 *  2. Cloudinary (if CLOUDINARY_URL is set)
 *  3. Falls back to a graceful 501 with clear instructions
 *
 * Add at least one storage env var to enable real persistence.
 */
import jwt from 'jsonwebtoken';

export const config = { api: { bodyParser: false } };

function verifyToken(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'change_this_in_production_please');
  } catch {
    return null;
  }
}

async function parseMultipart(req) {
  const busboy = (await import('busboy')).default;
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers, limits: { fileSize: 15 * 1024 * 1024 } });
    const files = {};
    bb.on('file', (name, stream, info) => {
      const chunks = [];
      stream.on('data', d => chunks.push(d));
      stream.on('end', () => {
        files[name] = { buffer: Buffer.concat(chunks), filename: info.filename, mimeType: info.mimeType };
      });
    });
    bb.on('finish', () => resolve(files));
    bb.on('error', reject);
    req.pipe(bb);
  });
}

async function uploadToVercelBlob(buffer, filename, contentType) {
  const { put } = await import('@vercel/blob');
  const blob = await put(`uploads/${filename}`, buffer, { access: 'public', contentType });
  return blob.url;
}

async function uploadToCloudinary(buffer, publicId) {
  const cloudinary = (await import('cloudinary')).v2;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ public_id: publicId, overwrite: true }, (err, result) => {
      if (err) reject(err);
      else resolve(result.secure_url);
    });
    stream.end(buffer);
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ message: 'Unauthorized. Please log in.' });

  const uploadType = req.query.type || req.url.split('/').pop() || 'file';

  let files;
  try {
    files = await parseMultipart(req);
  } catch (err) {
    return res.status(400).json({ message: 'Failed to parse upload: ' + err.message });
  }

  const file = files.file;
  if (!file) return res.status(400).json({ message: 'No file provided. Field name must be "file".' });

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'video/mp4', 'video/webm'];
  if (!allowedTypes.includes(file.mimeType)) {
    return res.status(400).json({ message: `File type "${file.mimeType}" is not allowed.` });
  }

  const ext = file.filename.split('.').pop() || 'bin';
  const safePublicId = `alpha-ultimate/${uploadType}-${Date.now()}`;
  const safeFilename = `${safePublicId}.${ext}`;

  try {
    let url = null;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      url = await uploadToVercelBlob(file.buffer, safeFilename, file.mimeType);
    } else if (process.env.CLOUDINARY_URL) {
      url = await uploadToCloudinary(file.buffer, safePublicId);
    } else {
      // No storage configured — return helpful instructions
      return res.status(501).json({
        message: 'File upload requires a storage backend. Please configure one of the following:',
        options: [
          'Vercel Blob: Set BLOB_READ_WRITE_TOKEN in your Vercel project environment variables.',
          'Cloudinary: Set CLOUDINARY_URL (format: cloudinary://api_key:api_secret@cloud_name).',
        ],
        docs: {
          vercelBlob: 'https://vercel.com/docs/storage/vercel-blob',
          cloudinary: 'https://cloudinary.com/documentation',
        },
        uploadedBy: decoded.username,
        fileReceived: { name: file.filename, size: file.buffer.length, type: file.mimeType },
      });
    }

    console.log(`[Upload] ${uploadType} uploaded by ${decoded.username}: ${url}`);
    return res.status(200).json({ success: true, url, type: uploadType });

  } catch (err) {
    console.error('[Upload] Error:', err);
    return res.status(500).json({ message: 'Upload failed: ' + err.message });
  }
}
