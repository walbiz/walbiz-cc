import { getFranchises, getFranchise, createFranchise, updateFranchise, deleteFranchise } from '../controllers/franchises.js';
import express from 'express';

const router = express.Router();

router.get('/', getFranchises);
router.get('/:franchiseId', getFranchise);
router.post('/', createFranchise);
router.put('/', updateFranchise);
router.delete('/:franchiseId', deleteFranchise);

export default router;
