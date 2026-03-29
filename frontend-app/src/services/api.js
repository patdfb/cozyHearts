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
