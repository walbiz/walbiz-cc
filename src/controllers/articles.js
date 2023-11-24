const Article = require('../models/article');

// CRUD Controllers

//GET All Articles
exports.getArticles = (req, res, next) => {
  Article.findAll()
    .then((articles) => {
      res.status(200).json({ articles: articles });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};

//GET Article by ID
exports.getArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  Article.findByPk(articleId)
    .then((article) => {
      if (!article) {
        return res.status(404).json({ message: 'Article not found!' });
      }
      return res.status(200).json({ article: article });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
};

//POST Article
exports.createArticle = (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;
  const source = req.body.source;
  const image_url = req.body.imageUrl;
  const content = req.body.content;

  if (!title) {
    res.status(400).json({ message: 'Title is required!' });
  } else if (!author) {
    res.status(400).json({ message: 'Author is required!' });
  } else if (!source) {
    res.status(400).json({ message: 'Source is required' });
  } else if (!content) {
    res.status(400).json({ message: 'Content is required!' });
  } else {
    Article.create({
      title: title,
      author: author,
      source: source,
      image_url: image_url,
      content: content,
    })
      .then((result) => {
        console.log('Article created!');
        res.status(201).json({ message: 'Article successfully created!', article: result });
      })
      .catch((err) => {
        console.error('Error creating article:', err);
        res.status(500).json({ message: 'Internal server error' });
      });
  }
};

//PUT Article by ID
exports.updateArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  const updatedTitle = req.body.title;
  const updatedAuthor = req.body.author;
  const updatedSource = req.body.source;
  const updatedImageUrl = req.body.imageUrl;
  const updatedContent = req.body.content;

  Article.findByPk(articleId)
    .then((article) => {
      if (!article) {
        return res.status(404).json({ message: 'Article not found!' });
      }

      article.title = updatedTitle;
      article.author = updatedAuthor;
      article.source = updatedSource;
      article.image_url = updatedImageUrl;
      article.content = updatedContent;

      return article.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Article updated!', article: result });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
};

//DELETE Article by ID
exports.deleteArticle = (req, res, next) => {
  const articleId = req.params.articleId;

  Article.findByPk(articleId)
    .then((article) => {
      if (!article) {
        return res.status(404).json({ message: 'Article not found!' });
      }

      return Article.destroy({
        where: {
          id: articleId,
        },
      });
    })
    .then((result) => {
      if (result === 1) {
        res.status(200).json({ message: 'Article deleted!' });
      } else {
        res.status(500).json({ message: 'Error deleting articel!' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
};
