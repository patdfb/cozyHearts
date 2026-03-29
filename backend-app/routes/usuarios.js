import express from 'express'
import { supabase } from '../lib/supabase.js'

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

// List all users
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Usuario')
      .select('id, Email, Nome, Telemovel, Data_de_Nascimento, Localidade, Image')
      .order('id', { ascending: true })

    if (error) return res.status(500).json({ error: error.message })

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user profile
router.get('/profile', requireUsuario, async (req, res) => {
  try {
    const { data: usuario, error } = await supabase
      .from('Usuario')
      .select('*, Usuario_Interesse(*)')
      .eq('id', req.usuario.id)
      .single()

    if (error || !usuario) return res.status(404).json({ error: 'Usuario not found' })

    res.json(usuario)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user activities
router.get('/activities', requireUsuario, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Participante')
      .select('*, Atividade(*, Interesse(*), Localidade(*), Participante(*, Usuario(*)))')
      .eq('Id_Usuario', req.usuario.id)

    if (error) return res.status(500).json({ error: error.message })

    // Find the organizer for each activity
    const activitiesWithOrganizer = data.map(p => {
      const organizador = p.Atividade.Participante?.find(part => part.Organizador)
      return {
        ...p.Atividade,
        isOrganizador: p.Organizador,
        nomeOrganizador: organizador?.Usuario?.Nome || 'Desconhecido'
      }
    })

    res.json(activitiesWithOrganizer)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add interest to user
router.post('/interests/:id_interesse', requireUsuario, async (req, res) => {
  try {
    const { data: existingInterest } = await supabase
      .from('Usuario_Interesse')
      .select('*')
      .eq('id_Usuario', req.usuario.id)
      .eq('id_Interesse', req.params.id_interesse)

    if (existingInterest && existingInterest.length > 0) {
      return res.status(400).json({ error: 'You already have this interest' })
    }

    const { error } = await supabase
      .from('Usuario_Interesse')
      .insert({
        id_Usuario: req.usuario.id,
        id_Interesse: req.params.id_interesse
      })

    if (error) return res.status(500).json({ error: error.message })

    res.json({ message: 'Interest added successfully.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Remove interest from user
router.delete('/interests/:id_interesse', requireUsuario, async (req, res) => {
  try {
    const { error } = await supabase
      .from('Usuario_Interesse')
      .delete()
      .eq('id_Usuario', req.usuario.id)
      .eq('id_Interesse', req.params.id_interesse)

    if (error) return res.status(500).json({ error: error.message })

    res.json({ message: 'Interest removed successfully.' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
