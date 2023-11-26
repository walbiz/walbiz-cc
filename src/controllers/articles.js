import { query } from '../db/index.js';

// CRUD Controllers

//GET All Articles
// export const getArticles = async (req, res, next) => {
//   try {
//     const articlesQuery = 'SELECT * FROM articles';
//     const result = await query(articlesQuery);
//     return res.status(200).json({ articles: result.rows });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

export const getArticles = async (req, res, next) => {
  try {
    // Extract query parameters
    const { limit, offset, search } = req.query;

    // Check if all parameters are empty
    if (!limit && !offset && !search) {
      const articlesQuery = 'SELECT * FROM articles';
      const result = await query(articlesQuery);
      return res.status(200).json({ articles: result.rows });
    }

    // Build the base SQL query
    let articlesQuery = 'SELECT *, COUNT(*) OVER() AS total_count FROM articles';

    // Add search condition if provided
    if (search) {
      articlesQuery += ` WHERE title ILIKE $1 OR description ILIKE $1`;
    }

    // Add limit and offset conditions if provided
    let params = [];
    let paramIndex = 1; // Start index for parameters

    if (search) {
      params.push(`%${search}%`);
      paramIndex++; // Move to the next index for parameters
    }

    if (limit) {
      articlesQuery += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit));
      paramIndex++; // Move to the next index for parameters
    }

    if (offset) {
      articlesQuery += ` OFFSET $${paramIndex}`;
      params.push(parseInt(offset));
    }

    // Execute the query
    const result = await query(articlesQuery, params);

    // Extract relevant data from the result
    const articles = result.rows;
    const totalCount = articles.length > 0 ? parseInt(articles[0].total_count) : 0;

    // Format the response
    const response = {
      nodes: articles.map((article) => ({
        id: article.id,
        title: article.title,
        description: article.description,
        image_url: article.image_url,
        updated_at: article.updated_at,
      })),
      total_count: totalCount,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//GET Article by ID
export const getArticle = async (req, res, next) => {
  const articleId = req.params.articleId;

  try {
    const articleQuery = 'SELECT * FROM articles WHERE id = $1';
    const result = await query(articleQuery, [articleId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found!' });
    }

    return res.status(200).json({ article: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
};

// POST Article
export const createArticle = async (req, res, next) => {
  const { title, author, source, description, content, image_url } = req.body;

  const data = {
    title,
    author,
    source,
    description,
    content,
  };

  const missingField = Object.keys(data).find((key) => !data[key]);

  if (missingField) {
    return res.status(400).json({ message: `${missingField} is required!` });
  } else {
    try {
      const createArticleQuery = `INSERT INTO articles (title, author, source, description, content, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

      const result = await query(createArticleQuery, [title, author, source, description, content, image_url]);

      console.log('Article created!');
      return res.status(201).json({ message: 'Article successfully created!', article: result.rows[0] });
    } catch (err) {
      console.error('Error creating article:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

//PUT Article by ID
export const updateArticle = async (req, res, next) => {
  const articleId = req.params.articleId;
  const updatedTitle = req.body.title;
  const updatedAuthor = req.body.author;
  const updatedSource = req.body.source;
  const updatedDescription = req.body.description;
  const updatedContent = req.body.content;
  const updatedImageUrl = req.body.imageUrl;

  try {
    const checkArticleQuery = 'SELECT * FROM articles WHERE id = $1';
    const checkResult = await query(checkArticleQuery, [articleId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found!' });
    }

    const existingArticle = checkResult.rows[0];

    const updateArticleQuery = `UPDATE articles SET title = $2, author = $3, source = $4, description = $5, content = $6, image_url = $7 WHERE id = $1 RETURNING *`;

    const updateResult = await query(updateArticleQuery, [articleId, updatedTitle, updatedAuthor, updatedSource, updatedDescription, updatedContent, updatedImageUrl]);

    return res.status(200).json({ message: 'Article updated!', article: updateResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// //DELETE Article by ID
export const deleteArticle = async (req, res, next) => {
  const articleId = req.params.articleId;

  try {
    const checkArticleQuery = 'SELECT * FROM articles WHERE id = $1';
    const checkResult = await query(checkArticleQuery, [articleId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Article not found!' });
    }

    const deleteArticleQuery = 'DELETE FROM articles WHERE id = $1';
    const deleteResult = await query(deleteArticleQuery, [articleId]);

    if (deleteResult.rowCount === 1) {
      res.status(200).json({ message: 'Article deleted!' });
    } else {
      res.status(500).json({ message: 'Error deleting article!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
