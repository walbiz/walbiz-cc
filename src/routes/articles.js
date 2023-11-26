import { getArticles, getArticle, createArticle, updateArticle, deleteArticle } from '../controllers/articles.js';
import express from 'express';

const router = express.Router();

// CRUD Routes /articles
router.get('/', getArticles); // /articles
router.get('/:articleId', getArticle); // /articles/article:Id
router.post('/', createArticle); // /articles
router.put('/:articleId', updateArticle); // /articles/:articleId
router.delete('/:articleId', deleteArticle); // /articles/:articleId

export default router;
