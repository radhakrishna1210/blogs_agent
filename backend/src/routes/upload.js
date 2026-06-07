import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateRequest, requireAdmin, requireAuth } from '../middleware/auth.js';
import { env } from '../config/env.js';

export const uploadRouter = Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed (jpeg, jpg, png, webp, gif).'));
  },
});

uploadRouter.post('/', authenticateRequest, requireAuth, requireAdmin, upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded.' });
    }

    // Return the URL to access the uploaded file
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${env.port}`;
    const fileUrl = `${backendUrl}/uploads/${req.file.filename}`;

    return res.json({
      ok: true,
      url: fileUrl,
    });
  } catch (error) {
    return next(error);
  }
});
