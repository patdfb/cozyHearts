import TitleButtons from '../../components/TitleButtons'
import EventCard from '../../components/EventCard'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function MyEvents() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchEventos = async () => {
    try {
      setError('')
      const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth') || 'null')

      const allRes = await fetch('http://localhost:3000/atividades')
      if (!allRes.ok) {
        setError('Erro ao buscar eventos')
        setEventos([])
        return
      }

      const allData = await allRes.json()
      const allEventos = Array.isArray(allData) ? allData : []

      if (!authData?.token) {
        setEventos(
          allEventos.map((evento) => ({
            ...evento,
            inscrito: false,
            nomeOrganizador: evento.nomeOrganizador || 'Cozy Hearts'
          }))
        )
        return
      }

      const userRes = await fetch('http://localhost:3000/usuarios/activities', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authData.token}`,
          'Content-Type': 'application/json'
        }
      })

      let userData = []
      if (userRes.ok) {
        const parsed = await userRes.json()
        userData = Array.isArray(parsed) ? parsed : []
      }

      const subscribedIds = new Set(userData.map((evento) => evento.id))
      const organizerById = new Map(userData.map((evento) => [evento.id, evento.nomeOrganizador]))

      setEventos(
        allEventos.map((evento) => ({
          ...evento,
          inscrito: subscribedIds.has(evento.id),
          nomeOrganizador: organizerById.get(evento.id) || evento.nomeOrganizador || 'Cozy Hearts'
        }))
      )
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventos()
  }, [])

  const handleSubscribe = async (id) => {
    try {
      setError('')
      const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth') || 'null')
      if (!authData?.token) {
        setError('Faça login para se inscrever em eventos.')
        return
      }

      const res = await fetch(`http://localhost:3000/atividades/${id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Não foi possível inscrever no evento.')
        return
      }

      await fetchEventos()
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro ao inscrever no evento')
    }
  }

  const handleCancelSubscription = async (id) => {
    try {
      setError('')
      const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth') || 'null')
      if (!authData?.token) {
        setError('Faça login para cancelar inscrição.')
        return
      }

      const res = await fetch(`http://localhost:3000/atividades/${id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Não foi possível cancelar inscrição.')
        return
      }

      await fetchEventos()
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro ao cancelar inscrição')
    }
  }

  const formatarData = (dia_hora) => {
    if (!dia_hora) return ''
    // Tenta parsear se for ISO ou formato string
    try {
      const date = new Date(dia_hora)
      return date.toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return dia_hora
    }
  }

  const formatarHora = (dia_hora) => {
    if (!dia_hora) return ''
    try {
      const date = new Date(dia_hora)
      return date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  const obterLocal = (evento) => {
    const endereco = evento.Endereco || ''
    let localidade = ''
    
    // Tenta Localidade (relação com Localidade table)
    if (evento.Localidade && typeof evento.Localidade === 'object' && !Array.isArray(evento.Localidade)) {
      const freguesia = evento.Localidade.Freguesia || ''
      const cidade = evento.Localidade.Cidade || ''
      localidade = `${freguesia}${freguesia && cidade ? ', ' : ''}${cidade}`
    }
    
    // Se Localidade é um array (relação múltipla)
    if (Array.isArray(evento.Localidade) && evento.Localidade.length > 0) {
      const loc = evento.Localidade[0]
      const freguesia = loc.Freguesia || ''
      const cidade = loc.Cidade || ''
      localidade = `${freguesia}${freguesia && cidade ? ', ' : ''}${cidade}`
    }
    
    // Combina endereco com localidade
    if (endereco && localidade) {
      return `${endereco}, ${localidade}`
    }
    return endereco || localidade || 'Local não especificado'
  }

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col">
        <TitleButtons/>
        <div className="px-4">
          {loading && <p>Carregando eventos...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && eventos.length === 0 && <p>Nenhum evento encontrado</p>}
          {eventos.map((evento) => (
            <EventCard 
              key={evento.id}
              name={evento.Nome} 
              date={formatarData(evento.dia_hora)}
              time={formatarHora(evento.dia_hora)}
              place={obterLocal(evento)}
              organizer={evento.nomeOrganizador || 'Cozy Hearts'}
              onClick={() => navigate(`/eventDetails/${evento.id}`)}
              subscribe={!evento.inscrito}
              onSubscribe={() => handleSubscribe(evento.id)}
              onCancelSubscription={() => handleCancelSubscription(evento.id)}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default MyEvents
