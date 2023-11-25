const controller = require('../controllers/articles');
const router = require('express').Router();

// CRUD Routes /articles
router.get('/', controller.getArticles); // /articles
router.get('/:articleId', controller.getArticle); // /articles/article:Id
router.post('/', controller.createArticle); // /articles
router.put('/:articleId', controller.updateArticle); // /articles/:articleId
router.delete('/:articleId', controller.deleteArticle); // /articles/:articleId

module.exports = router;
