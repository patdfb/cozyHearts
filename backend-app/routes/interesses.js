import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

// Middleware to require authenticated Usuario
async function requireUsuario(req, res, next) {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) return res.status(401).json({ error: 'Invalid or expired token' })

    const { data: usuario, error } = await supabase
      .from('Usuario')
      .select('*')
      .eq('Email', user.email)
      .single()

    if (error || !usuario) return res.status(404).json({ error: 'Usuario not found' })

    req.usuario = usuario
    next()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get all interests
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

// Get user's interests
router.get('/meus', requireUsuario, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Usuario_Interesse')
      .select(`
        id_Interesse,
        Interesse (*)
      `)
      .eq('id_Usuario', req.usuario.id);

    if (error) throw error;

    // Extract the Interesse objects
    const interesses = data.map(item => item.Interesse);
    res.json(interesses);
  } catch (err) {
    console.error('Erro ao buscar interesses do usuário:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Add interest to user
router.post('/adicionar/:id', requireUsuario, async (req, res) => {
  try {
    const interesseId = req.params.id;

    const { data, error } = await supabase
      .from('Usuario_Interesse')
      .insert({
        id_Interesse: interesseId,
        id_Usuario: req.usuario.id
      });

    if (error) throw error;
    res.json({ message: 'Interesse adicionado com sucesso' });
  } catch (err) {
    console.error('Erro ao adicionar interesse:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Remove interest from user
router.delete('/remover/:id', requireUsuario, async (req, res) => {
  try {
    const interesseId = req.params.id;

    const { data, error } = await supabase
      .from('Usuario_Interesse')
      .delete()
      .eq('id_Interesse', interesseId)
      .eq('id_Usuario', req.usuario.id);

    if (error) throw error;
    res.json({ message: 'Interesse removido com sucesso' });
  } catch (err) {
    console.error('Erro ao remover interesse:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
