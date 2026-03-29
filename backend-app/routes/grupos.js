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

// Get group details with members
router.get('/:id/members', requireUsuario, async (req, res) => {
  try {
    const grupoId = req.params.id

    // Fetch activity details with interest and localidade
    const { data: atividade, error: atividadeError } = await supabase
      .from('Atividade')
      .select('*, Interesse(*), Localidade(*)')
      .eq('id', grupoId)
      .single()

    if (atividadeError || !atividade) {
      return res.status(404).json({ error: 'Group not found' })
    }

    // Fetch all members (participants) of this activity
    const { data: participantes, error: participantesError } = await supabase
      .from('Participante')
      .select('*')
      .eq('Id_Atividade', grupoId)

    if (participantesError) {
      return res.status(500).json({ error: participantesError.message })
    }

    // Fetch user details for each participant
    const membros = await Promise.all(
      (participantes || []).map(async (p) => {
        const { data: usuario } = await supabase
          .from('Usuario')
          .select('id, Nome, Email, Image')
          .eq('id', p.Id_Usuario)
          .single()
        
        return {
          ...p,
          Usuario: usuario || { id: p.Id_Usuario, Nome: 'Desconhecido', Email: null, Image: null }
        }
      })
    )

    res.json({
      atividade: atividade,
      membros: membros || []
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
