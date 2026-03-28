import express from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase.js';
import upload from '../lib/storage.js';

const router = express.Router();

// Middleware para verificar se o membro existe e está verificado
async function requireVerifiedMembro(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('✗ Falta authorization header');
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('Verificando token...');
  
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    console.log('✗ Token inválido:', authError?.message || 'sem user');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  console.log('User autenticado:', user.email);

  const { data: membro, error } = await supabase
    .from('Membro')
    .select('*')
    .eq('Email', user.email)
    .single();

  if (error || !membro) {
    console.log('✗ Membro não encontrado:', error?.message);
    return res.status(404).json({ error: 'Membro not found' });
  }

  // Agora busca a instituição separadamente só se houver id_Instituicao
  if (membro.id_Instituicao) {
    const { data: instituicao } = await supabase
      .from('Instituicao')
      .select('*')
      .eq('id', membro.id_Instituicao)
      .single();
    
    membro.Instituicao = instituicao || null;
  } else {
    membro.Instituicao = null;
  }

  console.log('✓ Membro autenticado:', membro.Email, 'com instituição:', membro.Instituicao?.Nome);
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
    .select('*')
    .eq('Email', user.email)
    .single();

  if (error || !membro) return res.status(404).json({ error: 'Membro not found' });
  
  // Busca instituição separadamente se existir
  if (membro.id_Instituicao) {
    const { data: instituicao } = await supabase
      .from('Instituicao')
      .select('*')
      .eq('id', membro.id_Instituicao)
      .single();
    
    membro.Instituicao = instituicao || null;
  } else {
    membro.Instituicao = null;
  }
  
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
router.put('/me', requireVerifiedMembro, upload.single('image'), async (req, res) => {
  console.log('=== PUT /membros/me ===');
  console.log('User email:', req.membro.Email);
  console.log('Dados do corpo:', req.body);
  console.log('Tem ficheiro?', !!req.file);

  const updates = {};

  // Mapeamento manual para garantir que os valores do req.body vão para as colunas do Supabase
  if (req.body.nome && req.body.nome.trim()) {
    updates.Nome = req.body.nome.trim();
    console.log('✓ Nome será atualizado:', updates.Nome);
  }
  if (req.body.telefone && req.body.telefone.trim()) {
    updates.Telemovel = req.body.telefone.trim();
    console.log('✓ Telefone será atualizado:', updates.Telemovel);
  }
  if (req.body.nascimento && req.body.nascimento.trim()) {
    updates.Data_de_Nascimento = req.body.nascimento.trim();
    console.log('✓ Nascimento será atualizado:', updates.Data_de_Nascimento);
  }

  // Upload da imagem se houver ficheiro
  if (req.file) {
    try {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      console.log('A fazer upload da imagem:', fileName);
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from('Images')
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabaseAdmin.storage
        .from('Images')
        .getPublicUrl(fileName);

      updates.Image = urlData.publicUrl;
      console.log('✓ Imagem enviada:', updates.Image);
    } catch (err) {
      console.error('✗ Erro ao fazer upload:', err.message);
      return res.status(500).json({ error: 'Erro ao fazer upload da imagem: ' + err.message });
    }
  }

  console.log('Total de campos a atualizar:', Object.keys(updates).length);

  // Só executa se houver dados
  if (Object.keys(updates).length === 0) {
    console.log('✗ Nenhum dado a atualizar');
    return res.status(400).json({ error: 'Nenhum dado enviado para atualizar' });
  }

  console.log('Atualizando Supabase com:', updates);

  const { data, error } = await supabase
    .from('Membro')
    .update(updates)
    .eq('id', req.membro.id)
    .select()
    .single();

  if (error) {
    console.error('✗ Erro ao atualizar na BD:', error.message);
    return res.status(500).json({ error: 'Erro ao atualizar: ' + error.message });
  }

  // Busca instituição separadamente se existir
  if (data.id_Instituicao) {
    const { data: instituicao } = await supabase
      .from('Instituicao')
      .select('*')
      .eq('id', data.id_Instituicao)
      .single();
    
    data.Instituicao = instituicao || null;
  } else {
    data.Instituicao = null;
  }

  console.log('✓ Membro atualizado com sucesso:', data);
  res.json(data);
});

export default router;