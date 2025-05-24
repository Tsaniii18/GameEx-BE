import express from 'express';
import { 
  getAllGames, 
  getGameDetail,
  createGame,
  updateGame,
  applyDiscount,
  getSalesHistory,
  deleteGame
} from '../controllers/gameController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllGames);
router.get('/:id', getGameDetail);

// Protected routes
router.post('/', verifyToken, createGame);
router.put('/:id', verifyToken, updateGame);
router.patch('/:id/discount', verifyToken, applyDiscount);
router.get('/:id/sales', verifyToken, getSalesHistory);
router.delete('/:id', deleteGame);

export default router;