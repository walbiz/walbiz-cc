import multer from "multer";
import { Storage } from "@google-cloud/storage";
import path from "path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "../../ServiceAccounts.json");

const storage = new Storage({
  projectId: "walbiz",
  keyFilename: serviceAccountPath,
});

export const bucket = storage.bucket("walbiz-assets");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("images/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 3 * 1000 * 1000, // 3 MB
  },
});
