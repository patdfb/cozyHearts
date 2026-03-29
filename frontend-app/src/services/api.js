const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const getInteresses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/interesses`)
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
    const response = await fetch(`${API_BASE_URL}/interesses/meus`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
    const response = await fetch(`${API_BASE_URL}/interesses/adicionar/${interesseId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
    const response = await fetch(`${API_BASE_URL}/interesses/remover/${interesseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error('Erro ao remover interesse')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao remover interesse:', error)
    throw error
  }
}
