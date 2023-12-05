import { getWishlists, getWishlistsByUserId, createWishlistByUserId, deleteWishlistByUserId } from '../controllers/wishlists.js';
import express from 'express';

const router = express.Router();

// CRUD Routes /wishlists

router.get('/', getWishlists); // /wishlists
router.get('/:userId', getWishlistsByUserId); // /wishlist/:wishlistId
router.post('/:userId', createWishlistByUserId); // /wishlists
router.delete('/:userId', deleteWishlistByUserId); // /wishlist/::wishlistId

export default router;
