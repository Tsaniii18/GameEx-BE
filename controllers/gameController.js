import { Op } from 'sequelize';
import Game from '../models/Game.js';
import Transaction from '../models/Transaction.js';
import Gallery from '../models/Gallery.js';

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getGameDetail = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createGame = async (req, res) => {
  try {
    const { nama, gambar, harga, tag, deskripsi } = req.body;
    const game = await Game.create({
      uploader_id: req.user.id,
      nama,
      gambar,
      harga,
      tag,
      deskripsi
    });
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    
    if (game.uploader_id !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const { nama, ...rest } = req.body;
    const updatedGame = await game.update({ nama, ...rest });
    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const applyDiscount = async (req, res) => {
  try {
    const { discount } = req.body;
    const game = await Game.findByPk(req.params.id);
    
    if (game.uploader_id !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const updatedGame = await game.update({ discount });
    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSalesHistory = async (req, res) => {
  try {
    const sales = await Transaction.findAll({
      include: [{
        model: Game,
        where: { uploader_id: req.user.id }
      }]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ msg: 'Game not found' });
    
    if (game.uploader_id !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await Promise.all([
      Transaction.destroy({ where: { id_game: game.id } }),
      Gallery.destroy({ where: { game_id: game.id } })
    ]);

    await game.destroy();
    res.json({ msg: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};