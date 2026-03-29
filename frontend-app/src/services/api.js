const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'
).replace(/\/$/, '')

export const getInteresses = async () => {
  try {
    let response = await fetch(`${API_BASE_URL}/interesses`)

    // Compatibility fallback for deployments without /interesses route
    if (response.status === 404) {
      response = await fetch(`${API_BASE_URL}/atividades`)
      if (!response.ok) {
        throw new Error('Erro ao buscar interesses')
      }

      const atividades = await response.json()
      const mapa = new Map()

      for (const atividade of Array.isArray(atividades) ? atividades : []) {
        const interesse = atividade?.Interesse
        const id = Number(interesse?.id ?? atividade?.id_interesse)
        if (!id || mapa.has(id)) continue

        mapa.set(id, {
          id,
          Nome: interesse?.Nome || 'Interesse',
          Descricao: interesse?.Descricao || '',
          Foto: interesse?.Foto || null
        })
      }

      return Array.from(mapa.values())
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar interesses')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar interesses:', error)
    throw error
  }
}

export const getMeusInteresses = async (token) => {
  try {
    let response = await fetch(`${API_BASE_URL}/interesses/meus`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    // Compatibility fallback for deployments that only expose interests via /usuarios
    if (response.status === 404) {
      const [profileRes, allRes] = await Promise.all([
        fetch(`${API_BASE_URL}/usuarios/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        getInteresses()
      ])

      if (!profileRes.ok) {
        throw new Error('Erro ao buscar meus interesses')
      }

      const profile = await profileRes.json()
      const allInteresses = Array.isArray(allRes) ? allRes : []
      const ids = new Set((profile?.Usuario_Interesse || []).map((item) => Number(item.id_Interesse)))
      return (Array.isArray(allInteresses) ? allInteresses : []).filter((interesse) => ids.has(Number(interesse.id)))
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar meus interesses')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar meus interesses:', error)
    throw error
  }
}

export const adicionarInteresse = async (interesseId, token) => {
  try {
    let response = await fetch(`${API_BASE_URL}/interesses/adicionar/${interesseId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.status === 404) {
      response = await fetch(`${API_BASE_URL}/usuarios/interests/${interesseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    }

    if (!response.ok) {
      throw new Error('Erro ao adicionar interesse')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao adicionar interesse:', error)
    throw error
  }
}

export const removerInteresse = async (interesseId, token) => {
  try {
    let response = await fetch(`${API_BASE_URL}/interesses/remover/${interesseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.status === 404) {
      response = await fetch(`${API_BASE_URL}/usuarios/interests/${interesseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    }

    if (!response.ok) {
      throw new Error('Erro ao remover interesse')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao remover interesse:', error)
    throw error
  }
}
