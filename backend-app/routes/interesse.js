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

// Get all interests
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Interesse')
      .select('*')
      .order('Nome', { ascending: true })

    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single interest
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Interesse')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Interest not found' })
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router