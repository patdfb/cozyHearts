import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Interesse')
      .select('*')
      .order('Nome', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar interesses:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
