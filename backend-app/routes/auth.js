import express from 'express'
import { supabase, supabaseAdmin } from '../lib/supabase.js'
import upload from '../lib/storage.js'

const router = express.Router()

// Register a new Usuario
router.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { email, password, nome, data_de_nascimento, telemovel } = req.body

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

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

    const { data: usuarioData, error: usuarioError } = await supabase
      .from('Usuario')
      .insert({
        Email: email,
        Nome: nome,
        Data_de_Nascimento: data_de_nascimento,
        Telemovel: telemovel,
        Image: imageUrl
      })
      .select()
      .single()

    if (usuarioError) return res.status(500).json({ error: usuarioError.message })

    res.status(201).json({
      message: 'Usuario registered successfully.',
      usuario: usuarioData
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) return res.status(401).json({ error: 'Invalid email or password' })

    const { data: usuario, error: usuarioError } = await supabase
      .from('Usuario')
      .select('*')
      .eq('Email', email)
      .single()

    if (usuarioError) return res.status(500).json({ error: 'Usuario record not found' })

    res.json({
      message: 'Login successful',
      token: authData.session.access_token,
      usuario
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Edit Usuario details + image
router.put('/usuario', upload.single('image'), async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' })

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) return res.status(401).json({ error: 'Invalid or expired token' })

    const { nome, data_de_nascimento, telemovel } = req.body

    const { data: usuario, error: findError } = await supabase
      .from('Usuario')
      .select('*')
      .eq('Email', user.email)
      .single()

    if (findError || !usuario) return res.status(404).json({ error: 'Usuario not found' })

    let imageUrl = usuario.Image

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

    const { data: updated, error: updateError } = await supabase
      .from('Usuario')
      .update({
        Nome: nome || usuario.Nome,
        Data_de_Nascimento: data_de_nascimento || usuario.Data_de_Nascimento,
        Telemovel: telemovel || usuario.Telemovel,
        Image: imageUrl
      })
      .eq('id', usuario.id)
      .select()
      .single()

    if (updateError) return res.status(500).json({ error: updateError.message })

    res.json({
      message: 'Usuario updated successfully.',
      usuario: updated
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
