import fs from 'fs';
import path from 'path';
import multer from 'multer';

const uploadRoot = process.env.UPLOAD_DIR || 'uploads';
const resolvedUploadDir = path.resolve(uploadRoot);

if (!fs.existsSync(resolvedUploadDir)) {
  fs.mkdirSync(resolvedUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, resolvedUploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });

export function uploadDirMiddleware(_req, _res, next) {
  next();
}
