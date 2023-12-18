import logRequest from '../middlewares/logs.js';
import { bucket } from '../middlewares/multer.js';
import express from 'express';
import { query } from '../db/index.js';

const app = express();

app.use(logRequest);

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const uploadImage = async (req, res, next, folder, updateQuery) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }

    if (!allowedImageTypes.includes(req.file.mimetype)) {
      throw new Error('Invalid file type. Only JPG, JPEG, or PNG images are allowed.');
    }

    const filename = `${new Date().getTime()}-${req.file.originalname}`;
    const destinationFolder = `public/${folder}`;

    const file = bucket.file(`${destinationFolder}/${filename}`);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    const imageUrl = `https://storage.googleapis.com/walbiz-assets/${destinationFolder}/${filename}`;

    res.status(200).json({ success: true, message: 'Upload berhasil', imageUrl });
  } catch (error) {
    console.error(`Error in upload${folder}: ${error.message}`);
    res.json({
      message: `Failed to upload ${folder.replace(/-/g, ' ')} image`,
      error: error.message,
    });
  }
};

export const uploadProfile = async (req, res, next) => {
  const userId = req.params.userId;
  const updateQuery = `
    UPDATE users
    SET profile_image_url = $2
    WHERE id = $1
  `;
  await uploadImage(req, res, next, 'profile-images', updateQuery, userId);
};

export const uploadFranchiseLogo = async (req, res, next) => {
  const updateQuery = null;
  await uploadImage(req, res, next, 'franchise-logo-images', updateQuery);
};

export const uploadFranchiseImage = async (req, res, next) => {
  const updateQuery = null;
  await uploadImage(req, res, next, 'franchise-images', updateQuery);
};

export const uploadArticleImage = async (req, res, next) => {
  const articleId = req.params.articleId;
  const updateQuery = `
    UPDATE articles
    SET image_url = $2
    WHERE id = $1
  `;
  await uploadImage(req, res, next, 'article-images', updateQuery, articleId);
};
