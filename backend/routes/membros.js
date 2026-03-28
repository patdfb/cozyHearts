import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

// Middleware para verificar se o membro existe e está verificado
async function requireVerifiedMembro(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid or expired token' });

  const { data: membro, error } = await supabase
    .from('Membro')
    .select('*, Instituicao(*)')
    .eq('Email', user.email)
    .single();

  if (error || !membro) return res.status(404).json({ error: 'Membro not found' });
  
  req.membro = membro;
  next();
}

// Rota para obter dados do próprio membro logado
router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid or expired token' });

  const { data: membro, error } = await supabase
    .from('Membro')
    .select('*, Instituicao(*)')
    .eq('Email', user.email)
    .single();

  if (error || !membro) return res.status(404).json({ error: 'Membro not found' });
  res.json(membro);
});

// Rota para convidar membros
router.post('/invite', requireVerifiedMembro, async (req, res) => {
  const { email } = req.body;
  
  if (!req.membro.id_Instituicao || !req.membro.Instituicao.Verificacao) {
    return res.status(403).json({ error: 'Instituição não vinculada ou não verificada' });
  }

  const { data: target, error: findError } = await supabase
    .from('Membro')
    .select('*')
    .eq('Email', email)
    .single();

  if (findError || !target) return res.status(404).json({ error: 'Membro não encontrado' });
  if (target.id_Instituicao) return res.status(400).json({ error: 'Membro já pertence a uma instituição' });

  const { error: updateError } = await supabase
    .from('Membro')
    .update({ id_Instituicao: req.membro.id_Instituicao })
    .eq('id', target.id);

  if (updateError) return res.status(500).json({ error: updateError.message });

  res.json({ message: `${email} foi adicionado à sua instituição.` });
});


// Atualizar dados do próprio membro logado
import upload from '../lib/storage.js';
router.put('/me', requireVerifiedMembro, upload.single('image'), async (req, res) => {
  // 1. Verifica no terminal do VS Code se isto aparece:
  console.log('Dados recebidos:', req.body); 

  const updates = {};

  // Mapeamento manual para garantir que os valores do req.body vão para as colunas do Supabase
  if (req.body.nome) updates.Nome = req.body.nome;
  if (req.body.telefone) updates.Telemovel = req.body.telefone;
  if (req.body.nascimento) updates.Data_de_Nascimento = req.body.nascimento;

  if (req.file) {
    // ... lógica de upload para o storage que já tens no membros.js ...
    // updates.Image = imageUrl;
  }

  // 2. Só executa se houver dados
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Nenhum dado enviado corretamente' });
  }

  const { data, error } = await supabase
    .from('Membro')
    .update(updates)
    .eq('id', req.membro.id)
    .select('*, Instituicao(*)')
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

export default router;