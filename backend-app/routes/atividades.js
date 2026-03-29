import express from 'express'
import { supabase, supabaseAdmin } from '../lib/supabase.js'
import upload from '../lib/storage.js'

const router = express.Router()

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

// Get all activities
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Atividade')
      .select('*, Interesse(*), Localidade(*)')

    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single activity
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Atividade')
      .select('*, Interesse(*), Localidade(*), Participante(*)')
      .eq('id', req.params.id)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Activity not found' })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create activity with optional image
router.post('/', requireUsuario, upload.single('image'), async (req, res) => {
  try {
    const { nome, descricao, dia_hora, id_interesse, interesse_nome, interesse_descricao, endereco, freguesia, cidade } = req.body

    // Get or create Localidade
    let localidadeId = null
    if (freguesia && cidade) {
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
    }

    // Get or create Interesse
    let interesseId = id_interesse
    if (interesse_nome && !id_interesse) {
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

    const { data: atividade, error: ativError } = await supabase
      .from('Atividade')
      .insert({
        Nome: nome,
        Descricao: descricao,
        dia_hora,
        id_interesse: interesseId,
        Endereco: endereco,
        id_localidade: localidadeId,
        Image: imageUrl
      })
      .select()
      .single()

    if (ativError) return res.status(500).json({ error: ativError.message })

    // Add Usuario as Organizador
    const { error: partError } = await supabase
      .from('Participante')
      .insert({
        Id_Atividade: atividade.id,
        Id_Usuario: req.usuario.id,
        Organizador: true
      })

    if (partError) return res.status(500).json({ error: partError.message })

    res.status(201).json({
      message: 'Activity created successfully.',
      atividade
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Join activity
router.post('/:id/join', requireUsuario, async (req, res) => {
  try {
    const { data: existingParticipant } = await supabase
      .from('Participante')
      .select('*')
      .eq('Id_Atividade', req.params.id)
      .eq('Id_Usuario', req.usuario.id)

    if (existingParticipant && existingParticipant.length > 0) {
      return res.status(400).json({ error: 'You are already a participant in this activity' })
    }

    const { error } = await supabase
      .from('Participante')
      .insert({
        Id_Atividade: req.params.id,
        Id_Usuario: req.usuario.id,
        Organizador: false
      })

    if (error) {
      // 23505 = unique_violation in Postgres
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Nao foi possivel inscrever: conflito de chave unica na tabela Participante.'
        })
      }
      return res.status(500).json({ error: error.message })
    }

    res.json({ message: 'Joined activity successfully.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Leave activity
router.post('/:id/leave', requireUsuario, async (req, res) => {
  try {
    const { error } = await supabase
      .from('Participante')
      .delete()
      .eq('Id_Atividade', req.params.id)
      .eq('Id_Usuario', req.usuario.id)

    if (error) return res.status(500).json({ error: error.message })

    res.json({ message: 'Left activity successfully.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
