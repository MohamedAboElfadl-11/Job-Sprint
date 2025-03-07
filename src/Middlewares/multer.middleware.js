import multer from "multer";

export const MulterCloud = (allowedExtentions = []) => {
    const storage = multer.diskStorage({})
    const fileFilter = (req, file, cb) => {
        if (allowedExtentions.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type'), false)
        }
    }
    const upload = multer({ fileFilter, storage })
    return upload
}