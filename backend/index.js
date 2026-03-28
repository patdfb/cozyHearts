import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import atividadesRoutes from './routes/atividades.js';
import membrosRoutes from './routes/membros.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Permite apenas o teu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/atividades', atividadesRoutes);
app.use('/membros', membrosRoutes);

app.get('/', (req, res) => res.json({ message: 'Backend a funcionar com ES Modules!' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));