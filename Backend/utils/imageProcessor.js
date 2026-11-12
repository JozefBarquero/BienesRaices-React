import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const UPLOADS_DIR = './uploads';
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 8 * 1024 * 1024,
        files: 11
    },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME.has(file.mimetype)) {
            return cb(new Error('Formato de imagen inválido. Solo se admiten JPG, PNG y WebP.'));
        }
        cb(null, true);
    }
});

export const uploadMiddleware = upload.fields([
    { name: 'imagen_principal', maxCount: 1 },
    { name: 'imagenes_secundarias', maxCount: 10 }
]);

export const procesarYGuardarImagen = async (fileBuffer, fieldname) => {
    const filename = `${fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
    const outputPath = path.join(UPLOADS_DIR, filename);

    await sharp(fileBuffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

    return `/uploads/${filename}`;
};
