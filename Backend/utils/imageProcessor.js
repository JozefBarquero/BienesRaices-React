import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';





const UPLOADS_DIR = './uploads';
if (!fs.existsSync(UPLOADS_DIR)) {

    fs.mkdirSync(UPLOADS_DIR);

}


const upload = multer({

    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }

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