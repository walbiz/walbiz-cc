import { getWishlists, getWishlistsByUserId, createWishlistByUserId, deleteWishlistByUserId } from '../controllers/wishlists.js';
import express from 'express';

const router = express.Router();

router.get('/', getWishlists);
router.get('/:userId', getWishlistsByUserId);
router.post('/:userId', createWishlistByUserId);
router.delete('/:userId', deleteWishlistByUserId);
export default router;
