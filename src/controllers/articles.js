import { query } from '../db/index.js';

// CRUD Controllers

// GET Articles
export const getArticles = async (req, res, next) => {
  try {
    // Extract query parameters
    const { limit, offset, search } = req.query;

    const countParams = [];

    // Get total count of all items
    let searchQuery = '';
    if (search) {
      searchQuery = `
        WHERE
        title ILIKE $1
        OR description ILIKE $1
      `;
      countParams.push(`%${search}%`);
    }

    const totalCountQuery = `
            SELECT
              COUNT(a.id) AS total_count
            FROM
              articles a ${searchQuery}`;
    const countRes = await query(totalCountQuery, countParams);
    const totalCount = countRes.rows[0]['total_count'];

    // Initialize article query
    const params = [];
    let paramIndex = 1;

    let baseQuery = `
      SELECT
        a.id,
        a.title,
        a.description,
        a.image_url,
        a.updated_at
      FROM articles a
    `;

    // Add search condition if provided
    if (search) {
      baseQuery += ` WHERE title ILIKE $${paramIndex} OR description ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (limit) {
      baseQuery += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit));
      paramIndex++; // Move to the next index for parameters
    }

    if (offset) {
      baseQuery += ` OFFSET $${paramIndex}`;
      params.push(parseInt(offset));
    }

    // Execute the query
    const result = await query(baseQuery, params);

    // Extract relevant data from the result
    const articles = result.rows;

    // Format the response
    const response = {
      nodes: articles.map((article) => ({
        id: article.id,
        title: article.title,
        description: article.description,
        imageUrl: article.image_url,
        updatedAt: article.updated_at,
      })),
      totalCount: totalCount,
      error: null,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ nodes: null, totalCount: 0, error: 'INTERNAL_SERVER_ERROR' });
  }
};

//GET Article by ID
export const getArticle = async (req, res, next) => {
  const articleId = req.params.articleId;

  try {
    const articleQuery = 'SELECT * FROM articles WHERE id = $1';
    const result = await query(articleQuery, [articleId]);

    if (result.rows.length === 0) {
      return res.status(200).json({ article: null, error: 'ARTICLE_NOT_FOUND' });
    }

    return res.status(200).json({ article: result.rows[0], error: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ article: null, error: 'INTERNAL_SERVER_ERROR' });
  }
};

// POST Article
export const createArticle = async (req, res, next) => {
  const { title, author, source, description, content, imageUrl } = req.body;

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
      const createArticleQuery = `
              INSERT INTO articles (
                title, author, source, description, content, image_url) 
              VALUES 
                ($1, $2, $3, $4, $5, $6) RETURNING id
      `;

      const result = await query(createArticleQuery, [title, author, source, description, content, imageUrl]);

      console.log('Article created!');
      return res.status(201).json({ id: result.rows[0].id, error: null });
    } catch (err) {
      console.error('Error creating article:', err);
      res.status(500).json({ id: null, error: 'INTERNAL_SERVER_ERROR' });
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
      return res.status(404).json({ success: false, error: 'NOT_FOUND' });
    }

    const existingArticle = checkResult.rows[0];

    const updateArticleQuery = `UPDATE articles SET title = $2, author = $3, source = $4, description = $5, content = $6, image_url = $7 WHERE id = $1 RETURNING id`;

    const updateResult = await query(updateArticleQuery, [articleId, updatedTitle, updatedAuthor, updatedSource, updatedDescription, updatedContent, updatedImageUrl]);

    return res.status(200).json({ id: updateResult.rows[0].id, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ id: null, error: 'INTERNAL_SERVER_ERROR' });
  }
};

//DELETE Article by ID
export const deleteArticle = async (req, res, next) => {
  const articleId = req.params.articleId;

  try {
    const checkArticleQuery = 'SELECT * FROM articles WHERE id = $1';
    const checkResult = await query(checkArticleQuery, [articleId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'NOT_FOUND' });
    }

    const deleteArticleQuery = 'DELETE FROM articles WHERE id = $1';
    const deleteResult = await query(deleteArticleQuery, [articleId]);

    if (deleteResult.rowCount === 1) {
      res.status(200).json({ success: true, error: null });
    } else {
      res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'INTERNAL_SERVER_ERROR' });
  }
};
