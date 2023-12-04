import logRequest from '../middlewares/logs.js';
import { bucket } from '../middlewares/multer.js';
import express from 'express';
import { query } from '../db/index.js';

const app = express();

app.use(logRequest);

export const uploadProfile = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }

    const filename = `${new Date().getTime()}-${req.file.originalname}`;
    const destinationFolder = 'public/profile-images';

    const file = bucket.file(`${destinationFolder}/${filename}`);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    const imageUrl = `https://storage.googleapis.com/walbiz-assets/${destinationFolder}/${filename}`;

    const insertImageUrlQuery = `
            UPDATE users
            SET profile_image_url = $2
            WHERE id = $1
          `;
    const insertImageUrl = await query(insertImageUrlQuery, [userId, imageUrl]);

    return res.status(200).json({ success: true, userId: userId, command: insertImageUrl.command, imageUrl: imageUrl, error: null });
  } catch (err) {
    console.error(err);
    res.json({
      message: err.message,
    });
  }
};

export const uploadFranchiseLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }

    const filename = `${new Date().getTime()}-${req.file.originalname}`;
    const destinationFolder = 'public/franchise-logo-images';

    const file = bucket.file(`${destinationFolder}/${filename}`);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    res.json({
      success: true,
      message: 'Upload berhasil',
      imageUrl: `https://storage.googleapis.com/walbiz-assets/${destinationFolder}/${filename}`,
    });
  } catch (err) {
    console.error(err);
    res.json({
      message: err.message,
    });
  }
};

export const uploadFranchiseImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }

    const filename = `${new Date().getTime()}-${req.file.originalname}`;
    const destinationFolder = 'public/franchise-images';

    const file = bucket.file(`${destinationFolder}/${filename}`);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    res.json({
      success: true,
      message: 'Upload berhasil',
      imageUrl: `https://storage.googleapis.com/walbiz-assets/${destinationFolder}/${filename}`,
    });
  } catch (err) {
    console.error(err);
    res.json({
      message: err.message,
    });
  }
};

export const uploadArticleImage = async (req, res, next) => {
  const articleId = req.params.articleId;

  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }

    const filename = `${new Date().getTime()}-${req.file.originalname}`;
    const destinationFolder = 'public/article-images';

    const file = bucket.file(`${destinationFolder}/${filename}`);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    const imageUrl = `https://storage.googleapis.com/walbiz-assets/${destinationFolder}/${filename}`;

    const insertImageUrlQuery = `
            UPDATE articles
            SET image_url = $2
            WHERE id = $1
          `;
    const insertImageUrl = await query(insertImageUrlQuery, [articleId, imageUrl]);

    return res.status(200).json({ success: true, articleId: articleId, command: insertImageUrl.command, imageUrl: imageUrl, error: null });

    // res.json({
    //   message: 'Upload berhasil',
    //   imageUrl: `https://storage.googleapis.com/walbiz-assets/${destinationFolder}/${filename}`,
    // });
  } catch (err) {
    console.error(err);
    res.json({
      message: err.message,
    });
  }
};
