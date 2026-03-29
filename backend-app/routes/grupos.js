import express from 'express'
import { supabase } from '../lib/supabase.js'

const router = express.Router()

async function resolverPerfilParticipante(participante) {
  // Participante ligado a Usuario
  if (participante?.Id_Usuario) {
    const { data: usuario } = await supabase
      .from('Usuario')
      .select('id, Nome, Email, Image')
      .eq('id', participante.Id_Usuario)
      .single()

    if (usuario) {
      return {
        Usuario: usuario,
        nomeExibicao: usuario.Nome || 'Desconhecido',
      }
    }
  }

  // Participante ligado a Membro (instituicao)
  if (participante?.Id_Membro) {
    const { data: membro } = await supabase
      .from('Membro')
      .select('*')
      .eq('id', participante.Id_Membro)
      .single()

    if (membro) {
      const idInstituicao = membro.id_Instituicao ?? membro.id_Insti ?? membro.id_insti
      let nomeInstituicao = null

      if (idInstituicao) {
        const { data: instituicao } = await supabase
          .from('Instituicao')
          .select('Nome')
          .eq('id', idInstituicao)
          .single()

        nomeInstituicao = instituicao?.Nome || null
      }

      const nomeExibicao =
        (participante.Organizador && nomeInstituicao) ||
        membro.Nome ||
        nomeInstituicao ||
        'Desconhecido'

      return {
        Usuario: {
          id: participante.Id_Membro,
          Nome: nomeExibicao,
          Email: membro.Email || null,
          Image: membro.Image || null,
        },
        nomeExibicao,
      }
    }
  }

  return {
    Usuario: { id: null, Nome: 'Desconhecido', Email: null, Image: null },
    nomeExibicao: 'Desconhecido',
  }
}

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

    // Fetch participant display details for each participant
    const membros = await Promise.all(
      (participantes || []).map(async (p) => {
        const perfil = await resolverPerfilParticipante(p)
        
        return {
          ...p,
          Usuario: perfil.Usuario,
          nomeExibicao: perfil.nomeExibicao,
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
