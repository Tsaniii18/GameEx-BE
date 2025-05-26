import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Game from '../models/Game.js';
import Transaction from '../models/Transaction.js';
import Gallery from '../models/Gallery.js';

export const getCurrentUser = async (req, res) => {
  if (!req.user) return res.sendStatus(401);

  try {
    const user = await User.findByPk(req.params.decode, {
      attributes: ['id', 'username', 'email', 'foto_profil']
    });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { username, email, password, foto_profil } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
    }

    const updatedUser = await user.update(req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const buyGame = async (req, res) => {
  try {
    const { gameId, paymentMethod } = req.body;
    const user = req.user;
    
    const existing = await Gallery.findOne({ 
      where: { 
        user_id: user.id,
        game_id: gameId 
      } 
    });
    
    if (existing) return res.status(400).json({ msg: 'Game already owned' });
    
    const game = await Game.findByPk(gameId);
    if (game.uploader_id === user.id) {
      return res.status(400).json({ msg: 'Cannot buy own game' });
    }

    const hargaDiscount = game.harga * (1 - game.discount / 100);
    
    const transaction = await Transaction.create({
      id_game: gameId,
      id_pembeli: user.id,
      harga_awal: game.harga,
      metode_pembayaran: paymentMethod,
      discount: game.discount,
      harga_discount: hargaDiscount
    });

    await Gallery.create({
      user_id: user.id,
      game_id: gameId
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateGameStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const gameId = req.params.gameId;
    
    const galleryItem = await Gallery.findOne({
      where: {
        user_id: req.user.id,
        game_id: gameId
      }
    });
    
    if (!galleryItem) {
      return res.status(404).json({ msg: 'Game not found in library' });
    }
    
    await galleryItem.update({ status });
    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteFromLibrary = async (req, res) => {
  try {
    const gameId = req.params.gameId;
    
    const deleted = await Gallery.destroy({
      where: {
        user_id: req.user.id,
        game_id: gameId
      }
    });
    
    if (!deleted) {
      return res.status(404).json({ msg: 'Game not found in library' });
    }
    
    res.json({ msg: 'Game removed from library' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPurchaseHistory = async (req, res) => {
  try {
    const history = await Transaction.findAll({
      where: { id_pembeli: req.user.id },
      include: [Game]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getMyGames = async (req, res) => {
  try {
    const games = await Game.findAll({ 
      where: { uploader_id: req.user.id } 
    });
    res.json(games);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getLibrary = async (req, res) => {
  try {
    const library = await Gallery.findAll({
      where: { user_id: req.user.id },
      include: [Game]
    });
    res.json(library);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Hapus semua data terkait user
    await Promise.all([
      Game.destroy({ where: { uploader_id: user.id } }),
      Transaction.destroy({ where: { id_pembeli: user.id } }),
      Gallery.destroy({ where: { user_id: user.id } })
    ]);

    await user.destroy();
    res.clearCookie('accessToken');
    res.json({ msg: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};