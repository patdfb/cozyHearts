import { useNavigate } from 'react-router-dom'
import Title from '../../components/Title'
import InterestCard from '../../components/InterestCard'
import Button from '../../components/Button'
import { useState, useEffect } from 'react'

function OtherInterests() {
  const navigate = useNavigate()
  const [interests, setInterests] = useState([])
  const [userInterests, setUserInterests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInterests()
    fetchUserInterests()
  }, [])

  const fetchInterests = async () => {
    try {
      const res = await fetch('http://localhost:3000/interesses')
      if (!res.ok) {
        setError('Erro ao carregar interesses')
        return
      }
      const data = await res.json()
      setInterests(data)
    } catch (err) {
      console.error('Erro ao buscar interesses:', err)
      setError('Erro de conexão')
    }
  }

  const fetchUserInterests = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('cozy_hearts_auth') || 'null')
      if (!auth?.token) {
        setLoading(false)
        return
      }

      const res = await fetch('http://localhost:3000/usuarios/profile', {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })

      if (res.ok) {
        const userData = await res.json()
        setUserInterests((userData.Usuario_Interesse || []).map(ui => ui.id_Interesse))
      }
    } catch (err) {
      console.error('Erro ao buscar interesses do usuário:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddInterest = async (interestId) => {
    try {
      const auth = JSON.parse(localStorage.getItem('cozy_hearts_auth') || 'null')
      if (!auth?.token) {
        setError('Usuário não autenticado')
        return
      }

      const res = await fetch(`http://localhost:3000/usuarios/interests/${interestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })

      if (res.ok) {
        // Add to local state
        setUserInterests([...userInterests, interestId])
        setError('')
      } else {
        const data = await res.json()
        setError(data.error || 'Erro ao adicionar interesse')
      }
    } catch (err) {
      console.error('Erro ao adicionar interesse:', err)
      setError('Erro de conexão')
    }
  }

  // Filter out interests the user already has
  const availableInterests = interests.filter(interest => !userInterests.includes(interest.id))

  if (loading) {
    return (
      <section id="center" className="flex min-h-dvh w-full flex-col pb-24">
        <Title name={"Outros interesses"} path="/myInterests"/>
        <div className="px-4 py-8 text-center">
          <p>Carregando interesses...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col pb-24">
        <Title name={"Outros interesses"} path="/myInterests"/>
        <div className="px-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {availableInterests.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>Não há outros interesses disponíveis no momento.</p>
            </div>
          ) : (
            availableInterests.map((interest) => (
              <InterestCard
                key={interest.id}
                name={interest.Nome}
                photo={interest.Image || "https://via.placeholder.com/150?text=Interesse"}
                description={interest.Descricao || "Sem descrição disponível"}
                exclude={false}
                onClick={() => handleAddInterest(interest.id)}
              />
            ))
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white px-4 pb-4 pt-3">
        </div>
      </section>
    </>
  )
}

export default OtherInterests
