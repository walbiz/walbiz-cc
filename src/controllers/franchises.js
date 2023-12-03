import query from '../db/index.js';

// CRUD Controllers

// GET Franchises
export const getFranchises = async (req, res, next) => {
  try {
    // Extract query parameters
    const { limit, offset, search, enu } = req.query;

    const countParams = [];

    // Get total count of all items
    let searchQuery = '';
    if (search) {
      searchQuery = `
        WHERE
        name ILIKE $1
        OR category_id ILIKE $1
      `;
      countParams.push(`${search}`);
    }

    if (enu) {
      enumQuery = `
        WHERE f.type = $1
      `;
      countParams.push(`${enu}`);
    }

    const totalCountQuery = `
            SELECT
              COUNT(f.id) AS total_count
            FROM
              franchises f ${searchQuery}`;
    const countRes = await query(totalCountQuery, countParams);
    const totalCount = countRes.rows[0]['total_count'];

    // Initialize franchise query
    const params = [];
    let paramIndex = 1;

    let baseQuery = `
          SELECT
            f.id,
            f.name,
            f.type,
            f.category_id,
            f.type,
            fi.costs
          FROM franchises f
          JOIN franchise_investments fi 
            ON fi.id = f.franchise_investment_id
        `;

    // Add search condition if provided
    if (search) {
      baseQuery += ` WHERE name ILIKE $${paramIndex} OR category_id `;
      params.push(`%${search}`);
      paramIndex++;
    }

    if (enu) {
      baseQuery += ` WHERE f.type = $${paramIndex}`;
      params.push(`%${enu}%`);
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
    const franchises = result.rows;

    // Format the response
    const response = {
      nodes: franchises.map((franchise) => ({
        id: franchise.id,
        name: franchise.name,
        category: {
          id: category_id,
          name: franchise_category.category.name,
        },
        type: franchise.enu,
        cost: franchise_investments.cost,
        logoUrl: franchise.logo_image_url,
      })),
    };
  } catch (err) {}
};

// GET Franchise by ID
export const getFranchise = async (req, res, next) => {
  try {
  } catch (err) {}
};

// POST Franchise
export const createFranchise = async (req, res, next) => {
  try {
  } catch (err) {}
};

// PUT Franchise by ID
export const updateFranchise = async (req, res, next) => {
  try {
  } catch (err) {}
};

// DELETE Franchise by ID
export const deleteFranchise = async (req, res, next) => {
  try {
  } catch (err) {}
};
