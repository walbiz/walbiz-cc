import { getFranchises, getFranchise, createFranchise, updateFranchise, deleteFranchise } from '../controllers/franchises.js';
import express from 'express';

const router = express.Router();

// CRUD Routes /franchises
router.get('/', getFranchises); // /franchises
router.get('/:franchiseId', getFranchise); // /franchises/:id
router.post('/', createFranchise); // /franchises
router.put('/', updateFranchise); // /franchises/:id
router.delete('/:franchiseId', deleteFranchise); // /franchises/:franchiseId

export default router;
