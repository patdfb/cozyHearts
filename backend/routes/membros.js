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
  const { nome, telefone, nascimento } = req.body;
  let imageUrl = req.membro.Image;

  // Upload de nova imagem se enviada
  if (req.file) {
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const { supabaseAdmin } = await import('../lib/supabase.js');
    const { error: uploadError } = await supabaseAdmin.storage
      .from('Images')
      .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });
    if (uploadError) return res.status(500).json({ error: uploadError.message });
    const { data: urlData } = supabaseAdmin.storage
      .from('Images')
      .getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  const updates = {};
  if (nome) updates.Nome = nome;
  if (telefone) updates.Telemovel = telefone;
  if (nascimento) updates.Data_de_Nascimento = nascimento;
  if (imageUrl) updates.Image = imageUrl;

  const { data, error } = await supabase
    .from('Membro')
    .update(updates)
    .eq('id', req.membro.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;