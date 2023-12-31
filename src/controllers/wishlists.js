import { query } from '../db/index.js';

export const getWishlists = async (req, res, next) => {
  try {
    const { limit, offset, search, page, size } = req.query;

    const countParams = [];

    let searchQuery = '';
    if (search) {
      searchQuery = `
        WHERE
        name ILIKE $1
        OR type ILIKE $1
        OR category $1
        OR costs $1
      `;
      countParams.push(`%${search}%`);
    }

    const totalCountQuery = `
      SELECT
        COUNT(w.id) AS total_count
      FROM
        wishlists w ${searchQuery}
    `;
    const countRes = await query(totalCountQuery, countParams);
    const totalCount = countRes.rows[0].total_count;

    const params = [];
    let paramIndex = 1;

    let baseQuery = `
      SELECT
        w.id,
        w.user_id,
        w.name,
        w.type,
        w.category,
        w.costs,
        w.total_outlets,
        w.year_established,
        w.net_profits_per_month,
        w.license_duration_in_years,
        w.logo_image_url,
        w.image_url
      FROM wishlists w
    `;

    if (search) {
      baseQuery += ` WHERE name ILIKE $${paramIndex} OR type ILIKE $${paramIndex} OR category $${paramIndex} OR costs $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (page && size) {
      const pageSize = parseInt(size);
      const pageNumber = parseInt(page);
      const offset = (pageNumber - 1) * pageSize;
      baseQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(pageSize, offset);
    } else {
      if (limit) {
        baseQuery += ` LIMIT $${paramIndex}`;
        params.push(parseInt(limit));
        paramIndex++;
      }

      if (offset) {
        baseQuery += ` OFFSET $${paramIndex}`;
        params.push(parseInt(offset));
      }
    }

    const result = await query(baseQuery, params);

    const wishlists = result.rows;

    const response = {
      nodes: wishlists.map((wishlist) => ({
        id: wishlist.id,
        userId: wishlist.user_id,
        name: wishlist.name,
        type: wishlist.type,
        category: wishlist.category,
        costs: wishlist.costs,
        totalOutlets: wishlist.total_outlets,
        yearEstablished: wishlist.year_established,
        netProfitsPerMonth: wishlist.net_profits_per_month,
        licenseDurationInYears: wishlist.license_duration_in_years,
        logoImageUrl: wishlist.logo_image_url,
        imageUrl: wishlist.image_url,
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

export const getWishlistsByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const totalCountQuery = `
      SELECT COUNT(w.id) AS total_count
      FROM wishlists w
      WHERE user_id = $1
    `;

    const totalCountResult = await query(totalCountQuery, [userId]);
    const totalCount = totalCountResult.rows[0].total_count;

    let wishlistQuery = `
      SELECT
        w.id,
        w.user_id,
        w.name,
        w.type,
        w.category,
        w.costs,
        w.total_outlets,
        w.year_established,
        w.net_profits_per_month,
        w.license_duration_in_years,
        w.logo_image_url,
        w.image_url
      FROM wishlists w
      WHERE w.user_id = $1
    `;

    const result = await query(wishlistQuery, [userId]);

    const wishlists = result.rows;

    const response = {
      nodes: wishlists.map((wishlist) => ({
        id: wishlist.id,
        userId: wishlist.user_id,
        name: wishlist.name,
        type: wishlist.type,
        category: wishlist.category,
        costs: wishlist.costs,
        totalOutlets: wishlist.total_outlets,
        yearEstablished: wishlist.year_established,
        netProfitsPerMonth: wishlist.net_profit_per_months,
        licenseDurationInYears: wishlist.license_duration_in_years,
        logoImageUrl: wishlist.logo_image_url,
        imageUrl: wishlist.image_url,
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

export const createWishlistByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  const { name, type, description, category, costs, totalOutlets, websiteUrl, phoneNumber, emailAddress, yearEstablished, companyName, companyAddress, netProfitsPerMonth, licenseDurationInYears, royaltyFeesPerMonth, returnOfInvestment, logoImageUrl, imageUrl } = req.body;

  try {
    const createWishlistQuery = `
      INSERT INTO wishlists
        (user_id, name, type, description, category, costs, total_outlets, website_url, phone_number, email_address, year_established, company_name, company_address, net_profits_per_month, license_duration_in_years, royalty_fees_per_month, return_of_investment, logo_image_url, image_url )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19 )
      RETURNING
        id
    `;

    const result = await query(createWishlistQuery, [userId, name, type, description, category, costs, totalOutlets, websiteUrl, phoneNumber, emailAddress, yearEstablished, companyName, companyAddress, netProfitsPerMonth, licenseDurationInYears, royaltyFeesPerMonth, returnOfInvestment, logoImageUrl, imageUrl]);
    return res.status(201).json({ id: result.rows[0].id, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ id: null, error: 'INTERNAL_SERVER_ERROR' });
  }
};

export const deleteWishlistByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  const wishlistId = req.body.id;

  try {
    const checkWishlistQuery = 'SELECT * FROM wishlists WHERE user_id = $1 AND id = $2';
    const checkResult = await query(checkWishlistQuery, [userId, wishlistId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'NOT_FOUND' });
    }
    const deleteWishlistQuery = 'DELETE FROM wishlists WHERE user_id = $1 AND id = $2';
    const deleteResult = await query(deleteWishlistQuery, [userId, wishlistId]);

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
