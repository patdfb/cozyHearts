import express from 'express';
const router = express.Router();
import { supabase, supabaseAdmin } from '../lib/supabase.js';
import upload from '../lib/storage.js';

async function requireMembro(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' })

  const token = authHeader.replace('Bearer ', '')

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return res.status(401).json({ error: 'Invalid or expired token' })

  const { data: membro, error } = await supabase
    .from('Membro')
    .select('*, Instituicao(*)')
    .eq('Email', user.email)
    .single()

  if (error || !membro) return res.status(404).json({ error: 'Membro not found' })
  if (!membro.id_Instituicao) return res.status(403).json({ error: 'No institution linked' })
  if (!membro.Instituicao.Verificacao) return res.status(403).json({ error: 'Institution not verified yet' })

  req.membro = membro
  next()
}

// Get all activities organized by any member of the same institution
router.get('/', requireMembro, async (req, res) => {
  // 1. Buscar todos os membros da mesma instituição
  const { data: membros, error: membrosError } = await supabase
    .from('Membro')
    .select('id')
    .eq('id_Instituicao', req.membro.id_Instituicao);

  if (membrosError) return res.status(500).json({ error: membrosError.message });
  if (!membros || membros.length === 0) return res.json([]);

  const membrosIds = membros.map(m => m.id);

  // 2. Buscar todos os eventos organizados por esses membros
  const { data: participantes, error: partError } = await supabase
    .from('Participante')
    .select('*, Atividade(*, Interesse(*), Localidade(*))')
    .in('Id_Membro', membrosIds)
    .eq('Organizador', true);

  if (partError) return res.status(500).json({ error: partError.message });
  if (!participantes || participantes.length === 0) return res.json([]);

  // 3. Remover eventos duplicados (caso haja)
  const eventosMap = {};
  participantes.forEach(p => {
    if (p.Atividade && !eventosMap[p.Atividade.id]) {
      eventosMap[p.Atividade.id] = p.Atividade;
    }
  });
  const eventos = Object.values(eventosMap);

  res.json(eventos);
});

// Get single activity
router.get('/:id', requireMembro, async (req, res) => {
  const { data, error } = await supabase
    .from('Participante')
    .select('*, Atividade(*, Interesse(*), Localidade(*), Participante(*))')
    .eq('Id_Atividade', req.params.id)
    .eq('Id_Membro', req.membro.id)
    .eq('Organizador', true)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Activity not found or access denied' })
  res.json(data.Atividade)
})

// Create activity with optional image
router.post('/', requireMembro, upload.single('image'), async (req, res) => {
  const { nome, descricao, dia_hora, id_interesse, interesse_nome, interesse_descricao, endereco, freguesia, cidade } = req.body

  let localidadeId
  const { data: existingLocs } = await supabase
    .from('Localidade')
    .select('id')
    .eq('Freguesia', freguesia)
    .eq('Cidade', cidade)
    .limit(1)

  if (existingLocs && existingLocs.length > 0) {
    localidadeId = existingLocs[0].id
  } else {
    const { data: newLoc, error: locError } = await supabase
      .from('Localidade')
      .insert({ Freguesia: freguesia, Cidade: cidade })
      .select()
      .single()
    if (locError) return res.status(500).json({ error: locError.message })
    localidadeId = newLoc.id
  }

  let interesseId = id_interesse
  if (interesse_nome) {
    const { data: existingInts } = await supabase
      .from('Interesse')
      .select('id')
      .eq('Nome', interesse_nome)
      .limit(1)

    if (existingInts && existingInts.length > 0) {
      interesseId = existingInts[0].id
    } else {
      const { data: newInt, error: intError } = await supabase
        .from('Interesse')
        .insert({ Nome: interesse_nome, Descricao: interesse_descricao })
        .select()
        .single()
      if (intError) return res.status(500).json({ error: intError.message })
      interesseId = newInt.id
    }
  }

  let imageUrl = null

  if (req.file) {
    const fileName = `${Date.now()}-${req.file.originalname}`
    const { error: uploadError } = await supabaseAdmin.storage
      .from('Images')
      .upload(fileName, req.file.buffer, { contentType: req.file.mimetype })

    if (uploadError) return res.status(500).json({ error: uploadError.message })

    const { data: urlData } = supabaseAdmin.storage
      .from('Images')
      .getPublicUrl(fileName)

    imageUrl = urlData.publicUrl
  }

  // Dentro do router.post('/', ...) em atividades.js
const { data: atividade, error: atError } = await supabase
  .from('Atividade')
  .insert({ 
    Nome: nome, 
    Descricao: descricao, 
    dia_hora: dia_hora || null, // Garante que se estiver vazio vai null e não string vazia
    id_interesse: interesseId || 1, // Usa um ID de interesse padrão (ex: 1) se vier vazio
    Endereco: endereco, 
    id_localidade: localidadeId, 
    Image: imageUrl 
  })
  .select()
  .single()

  if (atError) return res.status(500).json({ error: atError.message })

  const { error: partError } = await supabase
    .from('Participante')
    .insert({
      Id_Atividade: atividade.id,
      Id_Membro: req.membro.id,
      Organizador: true
    })

  if (partError) return res.status(500).json({ error: partError.message })

  res.status(201).json(atividade)
})

// Update activity + optional image
router.put('/:id', requireMembro, upload.single('image'), async (req, res) => {
  const { data: part, error: partError } = await supabase
    .from('Participante')
    .select('*')
    .eq('Id_Atividade', req.params.id)
    .eq('Id_Membro', req.membro.id)
    .eq('Organizador', true)
    .single()

  if (partError || !part) return res.status(403).json({ error: 'Not authorized to edit this activity' })

  const { nome, descricao, dia_hora, id_interesse, interesse_nome, interesse_descricao, endereco, freguesia, cidade } = req.body

  const { data: existing, error: existingError } = await supabase
    .from('Atividade')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (existingError) return res.status(500).json({ error: existingError.message })

  let id_localidade = existing.id_localidade
  if (freguesia && cidade) {
    const { data: existingLocs } = await supabase
      .from('Localidade')
      .select('id')
      .eq('Freguesia', freguesia)
      .eq('Cidade', cidade)
      .limit(1)

    if (existingLocs && existingLocs.length > 0) {
      id_localidade = existingLocs[0].id
    } else {
      const { data: newLoc, error: locError } = await supabase
        .from('Localidade')
        .insert({ Freguesia: freguesia, Cidade: cidade })
        .select()
        .single()
      if (locError) return res.status(500).json({ error: locError.message })
      id_localidade = newLoc.id
    }
  }

  let finalInteresseId = existing.id_interesse
  if (id_interesse) {
    finalInteresseId = id_interesse
  } else if (interesse_nome) {
    const { data: existingInts } = await supabase
      .from('Interesse')
      .select('id')
      .eq('Nome', interesse_nome)
      .limit(1)

    if (existingInts && existingInts.length > 0) {
      finalInteresseId = existingInts[0].id
    } else {
      const { data: newInt, error: intError } = await supabase
        .from('Interesse')
        .insert({ Nome: interesse_nome, Descricao: interesse_descricao })
        .select()
        .single()
      if (intError) return res.status(500).json({ error: intError.message })
      finalInteresseId = newInt.id
    }
  }

  let imageUrl = existing.Image

  if (req.file) {
    const fileName = `${Date.now()}-${req.file.originalname}`
    const { error: uploadError } = await supabaseAdmin.storage
      .from('Images')
      .upload(fileName, req.file.buffer, { contentType: req.file.mimetype })

    if (uploadError) return res.status(500).json({ error: uploadError.message })

    const { data: urlData } = supabaseAdmin.storage
      .from('Images')
      .getPublicUrl(fileName)

    imageUrl = urlData.publicUrl
  }

  const { data, error } = await supabase
    .from('Atividade')
    .update({ Nome: nome, Descricao: descricao, dia_hora, id_interesse: finalInteresseId, Endereco: endereco, id_localidade, Image: imageUrl })
    .eq('id', req.params.id)
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Delete activity
router.delete('/:id', requireMembro, async (req, res) => {
  const { data: part, error: partError } = await supabase
    .from('Participante')
    .select('*')
    .eq('Id_Atividade', req.params.id)
    .eq('Id_Membro', req.membro.id)
    .eq('Organizador', true)
    .single()

  if (partError || !part) return res.status(403).json({ error: 'Not authorized to delete this activity' })

  // First delete all participants associated with this activity
  const { error: deleteParticipantsError } = await supabase
    .from('Participante')
    .delete()
    .eq('Id_Atividade', req.params.id)

  if (deleteParticipantsError) return res.status(500).json({ error: deleteParticipantsError.message })

  // Then delete the activity itself
  const { error } = await supabase
    .from('Atividade')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Atividade deleted' })
})

export default router;