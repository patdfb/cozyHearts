import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../../components/Title'
import InterestCard from '../../components/InterestCard'
import Button from '../../components/Button'
import { getInteresses } from '../../services/api'

function OtherInterests() {
  const navigate = useNavigate()
  const [interesses, setInteresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchInteresses()
  }, [])

  const fetchInteresses = async () => {
    try {
      setLoading(true)
      const data = await getInteresses()
      setInteresses(data)
      setError(null)
    } catch (err) {
      console.error('Erro ao carregar interesses:', err)
      setError('Erro ao carregar interesses')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col pb-24">
        <Title name={"Outros interesses"} path="/myInterests"/>
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
              exclude={false} 
              onClick={() => {}} 
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
