import express from 'express';
import multer from 'multer';
import { uploadArticleImage, uploadFranchiseImage, uploadFranchiseLogo, uploadProfile } from '../controllers/uploads.js';

const router = express.Router();
const upload = multer();

router.post('/profile', upload.single('image'), uploadProfile);
router.post('/profile/:userId', upload.single('image'), uploadProfile);
router.post('/franchise/logo', upload.single('logo'), uploadFranchiseLogo);
router.post('/franchise/image', upload.single('image'), uploadFranchiseImage);
router.post('/article/:articleId', upload.single('image'), uploadArticleImage);

export default router;
