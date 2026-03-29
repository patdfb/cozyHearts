import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../../components/Title'
import InterestCard from '../../components/InterestCard'
import Button from '../../components/Button'
import { getMeusInteresses, removerInteresse } from '../../services/api'

function MyInterests() {
  const navigate = useNavigate()
  const [interesses, setInteresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMeusInteresses()
  }, [])

  const fetchMeusInteresses = async () => {
    try {
      setLoading(true)
      const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth') || '{}')
      if (!authData.token) {
        setError('Utilizador não autenticado')
        return
      }

      const data = await getMeusInteresses(authData.token)
      setInteresses(data)
      setError(null)
    } catch (err) {
      console.error('Erro ao carregar meus interesses:', err)
      setError('Erro ao carregar meus interesses')
    } finally {
      setLoading(false)
    }
  }

  const handleExclude = async (interesseId) => {
    try {
      const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth') || '{}')
      if (!authData.token) {
        setError('Utilizador não autenticado')
        return
      }

      await removerInteresse(interesseId, authData.token)
      // Remove from local state
      setInteresses(interesses.filter(interesse => interesse.id !== interesseId))
    } catch (err) {
      console.error('Erro ao remover interesse:', err)
      setError('Erro ao remover interesse')
    }
  }

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col pb-24">
        <Title name={"Os meus interesses"}/>
        <div className="px-4">
          {loading && <p>Carregando interesses...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && interesses.length === 0 && <p>Nenhum interesse encontrado</p>}
          {!loading && interesses.map((interesse) => (
            <InterestCard
              key={interesse.id}
              name={interesse.Nome}
              photo={interesse.Foto || "https://i.ytimg.com/vi/uQd11N9pj5U/maxresdefault.jpg"}
              description={interesse.Descricao || "Sem descrição"}
              exclude={true}
              onClick={() => handleExclude(interesse.id)}
            />
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white px-4 pb-4 pt-3">
          <Button name="Outros interesses" onClick={() => navigate("/otherInterests")} />
        </div>
      </section>
    </>
  )
}

export default MyInterests
