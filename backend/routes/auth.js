import express from 'express';
const router = express.Router();
import { supabase, supabaseAdmin } from '../lib/supabase.js';
import upload from '../lib/storage.js';

// Register a new Membro
router.post('/register', upload.single('image'), async (req, res) => {
  const { email, password, nome, data_de_nascimento } = req.body

  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
  if (authError) return res.status(400).json({ error: authError.message })

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

  const { data: membroData, error: membroError } = await supabase
    .from('Membro')
    .insert({
      Email: email,
      Nome: nome,
      Data_de_Nascimento: data_de_nascimento,
      Image: imageUrl
    })
    .select()
    .single()

  if (membroError) return res.status(500).json({ error: membroError.message })

  res.status(201).json({
    message: 'Membro registered successfully.',
    membro: membroData
  })
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })
  if (authError) return res.status(401).json({ error: 'Invalid email or password' })

  const { data: membro, error: membroError } = await supabase
    .from('Membro')
    .select('*, Instituicao(*)')
    .eq('Email', email)
    .single()

  if (membroError) return res.status(500).json({ error: 'Membro record not found' })

  if (!membro.id_Instituicao) {
    return res.json({
      status: 'no_institution',
      message: 'You are not part of an institution. Would you like to register one?',
      token: authData.session.access_token,
      membro
    })
  }

  if (!membro.Instituicao.Verificacao) {
    return res.json({
      status: 'pending_verification',
      message: 'Your institution is awaiting admin approval.',
      token: authData.session.access_token,
      membro
    })
  }

  res.json({
    status: 'verified',
    token: authData.session.access_token,
    membro
  })
})

// Edit Membro details + image
router.put('/membro', upload.single('image'), async (req, res) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' })

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return res.status(401).json({ error: 'Invalid or expired token' })

  const { nome, data_de_nascimento } = req.body

  const { data: membro, error: findError } = await supabase
    .from('Membro')
    .select('*')
    .eq('Email', user.email)
    .single()

  if (findError || !membro) return res.status(404).json({ error: 'Membro not found' })

  let imageUrl = membro.Image

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
    .from('Membro')
    .update({
      Nome: nome,
      Data_de_Nascimento: data_de_nascimento,
      Image: imageUrl
    })
    .eq('Email', user.email)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Membro updated successfully.', membro: data })
})

// Register a new Institution
router.post('/instituicao', async (req, res) => {
  const { nome, endereco, freguesia, cidade, email } = req.body

  const { data: membro, error: membroFindError } = await supabase
    .from('Membro')
    .select('*')
    .eq('Email', email)
    .single()

  if (membroFindError || !membro) return res.status(404).json({ error: 'Membro not found' })
  if (membro.id_Instituicao) return res.status(400).json({ error: 'Membro already belongs to an institution' })

  // Check if Localidade already exists, if not create it
  let localidadeId
  const { data: existingLocalidades } = await supabase
    .from('Localidade')
    .select('*')
    .eq('Freguesia', freguesia)
    .eq('Cidade', cidade)
    .limit(1)

  if (existingLocalidades && existingLocalidades.length > 0) {
    localidadeId = existingLocalidades[0].id
  } else {
    const { data: newLocalidade, error: locError } = await supabase
      .from('Localidade')
      .insert({ Freguesia: freguesia, Cidade: cidade })
      .select()
      .single()

    if (locError) return res.status(500).json({ error: locError.message })
    localidadeId = newLocalidade.id
  }

  const { data: instData, error: instError } = await supabase
    .from('Instituicao')
    .insert({ Nome: nome, Endereco: endereco, id_localidade: localidadeId, Verificacao: false })
    .select()
    .single()

  if (instError) return res.status(500).json({ error: instError.message })

  const { error: membroError } = await supabase
    .from('Membro')
    .update({ id_Instituicao: instData.id })
    .eq('id', membro.id)

  if (membroError) return res.status(500).json({ error: membroError.message })

  res.status(201).json({
    message: 'Institution registered and awaiting verification.',
    instituicao: instData,
    id_localidade: localidadeId
  })
})

// Logout
router.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Logged out' })
})

export default router;