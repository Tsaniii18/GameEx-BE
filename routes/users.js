import express from 'express';
import { 
  updateProfile,
  buyGame,
  updateGameStatus,
  deleteFromLibrary,
  getPurchaseHistory,
  getMyGames,
  deleteAccount
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyToken);

router.put('/profile', updateProfile);
router.post('/buy', buyGame);
router.patch('/library/:gameId', updateGameStatus);
router.delete('/library/:gameId', deleteFromLibrary);
router.get('/history', getPurchaseHistory);
router.get('/my-games', getMyGames);
router.delete('/account', deleteAccount);

export default router;