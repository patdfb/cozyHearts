import { useNavigate } from 'react-router-dom'
import Title from '../../components/Title'
import InterestCard from '../../components/InterestCard'
import Button from '../../components/Button'
import { useState, useEffect } from 'react'

function MyInterests() {
  const navigate = useNavigate()
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserInterests()
  }, [])

  const fetchUserInterests = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('cozy_hearts_auth') || 'null')
      if (!auth?.token) {
        setError('Usuário não autenticado')
        setLoading(false)
        return
      }

      const res = await fetch('http://localhost:3000/usuarios/profile', {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })

      if (!res.ok) {
        setError('Erro ao carregar interesses')
        setLoading(false)
        return
      }

      const userData = await res.json()

      // Get full interest details for each user interest
      const interestsWithDetails = await Promise.all(
        (userData.Usuario_Interesse || []).map(async (userInterest) => {
          const interestRes = await fetch(`http://localhost:3000/interesses/${userInterest.id_Interesse}`)
          if (interestRes.ok) {
            const interestData = await interestRes.json()
            return {
              id: userInterest.id_Interesse,
              ...interestData
            }
          }
          return null
        })
      )

      setInterests(interestsWithDetails.filter(Boolean))
    } catch (err) {
      console.error('Erro ao buscar interesses:', err)
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveInterest = async (interestId) => {
    try {
      const auth = JSON.parse(localStorage.getItem('cozy_hearts_auth') || 'null')
      if (!auth?.token) return

      const res = await fetch(`http://localhost:3000/usuarios/interests/${interestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })

      if (res.ok) {
        // Remove from local state
        setInterests(interests.filter(interest => interest.id !== interestId))
      } else {
        setError('Erro ao remover interesse')
      }
    } catch (err) {
      console.error('Erro ao remover interesse:', err)
      setError('Erro de conexão')
    }
  }

  if (loading) {
    return (
      <section id="center" className="flex min-h-dvh w-full flex-col pb-24">
        <Title name={"Os meus interesses"}/>
        <div className="px-4 py-8 text-center">
          <p>Carregando interesses...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col pb-24">
        <Title name={"Os meus interesses"}/>
        <div className="px-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {interests.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>Você ainda não tem interesses cadastrados.</p>
              <p className="mt-2">Explore outros interesses para adicionar!</p>
            </div>
          ) : (
            interests.map((interest) => (
              <InterestCard
                key={interest.id}
                name={interest.Nome}
                photo={interest.Image || "https://via.placeholder.com/150?text=Interesse"}
                description={interest.Descricao || "Sem descrição disponível"}
                onClick={() => handleRemoveInterest(interest.id)}
                exclude={true}
              />
            ))
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white px-4 pb-4 pt-3">
          <Button name="Outros interesses" onClick={() => navigate("/otherInterests")} />
        </div>
      </section>
    </>
  )
}

export default MyInterests
