import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHttpError } from '../utils/http.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');
const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
];
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = file.originalname.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-').toLowerCase();
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `${base}-${unique}${ext}`);
    },
});
function fileFilter(_req, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(createHttpError(400, 'Unsupported file type'));
    }
    return cb(null, true);
}
export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});
//# sourceMappingURL=upload.middleware.js.map