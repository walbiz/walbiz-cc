import { getWishlists, getWishlistsByUserId, createWishlist, deleteWishlist } from '../controllers/wishlists.js';
import express from 'express';

const router = express.Router();

// CRUD Routes /wishlists

router.get('/', getWishlists); // /wishlists
router.get('/:userId', getWishlistsByUserId); // /wishlist/:wishlistId
router.post('/', createWishlist); // /wishlists
router.delete('/:wishlistId', deleteWishlist); // /wishlist/::wishlistId

export default router;
