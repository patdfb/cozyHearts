import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../../components/Title'
import InterestCard from '../../components/InterestCard'
import Button from '../../components/Button'
import { getInteresses, getMeusInteresses, adicionarInteresse } from '../../services/api'

function OtherInterests() {
  const navigate = useNavigate()
  const [allInteresses, setAllInteresses] = useState([])
  const [meusInteresses, setMeusInteresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchInteresses()
  }, [])

  const fetchInteresses = async () => {
    try {
      setLoading(true)
      const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth') || '{}')
      if (!authData.token) {
        setError('Utilizador não autenticado')
        return
      }

      const [allData, meusData] = await Promise.all([
        getInteresses(),
        getMeusInteresses(authData.token)
      ])

      setAllInteresses(allData)
      setMeusInteresses(meusData)
      setError(null)
    } catch (err) {
      console.error('Erro ao carregar interesses:', err)
      setError('Erro ao carregar interesses')
    } finally {
      setLoading(false)
    }
  }

  const handleAddInterest = async (interesseId) => {
    try {
      const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth') || '{}')
      if (!authData.token) {
        setError('Utilizador não autenticado')
        return
      }

      await adicionarInteresse(interesseId, authData.token)
      // Move interest from allInteresses to meusInteresses
      const interesse = allInteresses.find(i => i.id === interesseId)
      if (interesse) {
        setMeusInteresses([...meusInteresses, interesse])
      }
    } catch (err) {
      console.error('Erro ao adicionar interesse:', err)
      setError('Erro ao adicionar interesse')
    }
  }

  // Filter out interests that user already has
  const outrosInteresses = allInteresses.filter(interesse =>
    !meusInteresses.some(meuInteresse => meuInteresse.id === interesse.id)
  )

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col pb-24">
        <Title name={"Outros interesses"} path="/myInterests"/>
        <div className="px-4">
          {loading && <p>Carregando interesses...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && outrosInteresses.length === 0 && <p>Nenhum outro interesse encontrado</p>}
          {!loading && outrosInteresses.map((interesse) => (
            <InterestCard
              key={interesse.id}
              name={interesse.Nome}
              photo={interesse.Foto || "https://i.ytimg.com/vi/uQd11N9pj5U/maxresdefault.jpg"}
              description={interesse.Descricao || "Sem descrição"}
              exclude={false}
              buttonText="Adicionar interesse"
              onClick={() => handleAddInterest(interesse.id)}
            />
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white px-4 pb-4 pt-3">
        </div>
      </section>
    </>
  )
}

export default OtherInterests
