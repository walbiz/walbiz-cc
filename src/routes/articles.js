import { getArticles, getArticle, createArticle, updateArticle, deleteArticle } from '../controllers/articles.js';
import express from 'express';

const router = express.Router();

router.get('/', getArticles);
router.get('/:articleId', getArticle);
router.post('/', createArticle);
router.put('/:articleId', updateArticle);
router.delete('/:articleId', deleteArticle);

export default router;
