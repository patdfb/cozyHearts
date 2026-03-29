import TitleButtons from '../../components/TitleButtons'
import GroupCard from '../../components/GroupCard'
import { useState, useEffect } from 'react'

function MyGroups() {
  const [atividades, setAtividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth'))
        if (!authData || !authData.token) {
          setError('Não autenticado. Faça login primeiro.')
          setLoading(false)
          return
        }

        const res = await fetch('http://localhost:3000/usuarios/activities', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authData.token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) {
          setError('Erro ao buscar atividades')
          setLoading(false)
          return
        }

        const data = await res.json()
        setAtividades(data)
      } catch (err) {
        console.error('Erro:', err)
        setError('Erro de conexão com o servidor')
      } finally {
        setLoading(false)
      }
    }

    fetchAtividades()
  }, [])

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col">
        <TitleButtons/>
        <div className="px-4">
          {loading && <p>Carregando atividades...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && atividades.length === 0 && <p>Nenhuma atividade encontrada</p>}
          {atividades.map((atividade) => (
            <GroupCard 
              key={atividade.id}
              name={atividade.Nome} 
              photo={atividade.Image || "https://i.ytimg.com/vi/uQd11N9pj5U/maxresdefault.jpg"} 
              onClick={() => {}}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default MyGroups
