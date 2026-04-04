import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../../config/env.js';
import { createHttpError } from '../../utils/http.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../../uploads');
async function ensureUploadsDir() {
    await fs.mkdir(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: async (_req, _file, cb) => {
        try {
            await ensureUploadsDir();
            cb(null, uploadsDir);
        }
        catch (error) {
            cb(error);
        }
    },
    filename: (_req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_.]/g, '');
        const stamp = Date.now();
        cb(null, `${stamp}-${safeName}`);
    },
});
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else {
        cb(createHttpError(400, 'Only images and videos are allowed'));
    }
};
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 },
});
export const uploadsRouter = Router();
uploadsRouter.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        throw createHttpError(400, 'File is required');
    }
    const url = `${env.publicBaseUrl}/uploads/${req.file.filename}`;
    res.status(201).json({
        url,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
    });
});
//# sourceMappingURL=uploads.routes.js.map