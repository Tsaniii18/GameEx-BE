import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import authRoutes from './routes/auth.js';
import gamesRoutes from './routes/games.js';
import usersRoutes from './routes/users.js';

dotenv.config();
const app = express();

const corsOptions = {
  origin: 'https://a-07-451003.uc.r.appspot.com', // frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.options('*', cors(corsOptions)); // handle preflight

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

// Sync database
(async () => {
  try {
    await sequelize.sync();
    console.log('Database synced');
  } catch (error) {
    console.error('Database sync error:', error);
  }
})();

// Routes
app.use('/auth', authRoutes);
app.use('/games', gamesRoutes);
app.use('/users', usersRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));