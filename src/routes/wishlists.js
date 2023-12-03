import { getWishlists, createWishlist, deleteWishlist } from '../controllers/wishlists.js';
import express from 'express';

const router = express.Router();

// CRUD Routes /wishlists

router.get('/', getWishlists); // /wishlists
router.get('/wishlistId', getWishlists); // /wishlist/:wishlistId
router.post('/', createWishlist); // /wishlists
router.delete('/:wishlistId', deleteWishlist); // /wishlist/::wishlistId

export default router;
