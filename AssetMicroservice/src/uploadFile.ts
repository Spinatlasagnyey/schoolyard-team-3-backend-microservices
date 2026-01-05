import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "public/assets",
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

export default multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});