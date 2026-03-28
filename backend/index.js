import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import atividadesRoutes from './routes/atividades.js';
import membrosRoutes from './routes/membros.js';
import instituicaoRoutes from './routes/instituicao.js';
import interessesRoutes from './routes/interesses.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://www.cozyhearts.instituicoes.pt',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/atividades', atividadesRoutes);
app.use('/membros', membrosRoutes);
app.use('/instituicao', instituicaoRoutes);
app.use('/interesses', interessesRoutes);

app.get('/', (req, res) => res.json({ message: 'Backend a funcionar com ES Modules!' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));