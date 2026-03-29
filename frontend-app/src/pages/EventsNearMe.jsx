import Title from '../components/Title'
import EventCard from '../components/EventCard'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function EventsNearMe() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [locationHint, setLocationHint] = useState('')
  const navigate = useNavigate()

  const normalize = (text) => String(text || '').toLowerCase().trim()

  const isNear = (evento, userLocalidade) => {
    const localidade = normalize(userLocalidade)
    if (!localidade) return true

    const cidade = normalize(evento?.Localidade?.Cidade)
    const freguesia = normalize(evento?.Localidade?.Freguesia)
    const endereco = normalize(evento?.Endereco)

    return (
      (cidade && (localidade.includes(cidade) || cidade.includes(localidade))) ||
      (freguesia && (localidade.includes(freguesia) || freguesia.includes(localidade))) ||
      (endereco && localidade && endereco.includes(localidade))
    )
  }

  const fetchEventosPerto = async () => {
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

      let userData = []
      let userLocalidade = ''

      if (authData?.token) {
        const [activitiesRes, profileRes] = await Promise.all([
          fetch('http://localhost:3000/usuarios/activities', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authData.token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:3000/usuarios/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authData.token}`,
              'Content-Type': 'application/json'
            }
          })
        ])

        if (activitiesRes.ok) {
          const parsedActivities = await activitiesRes.json()
          userData = Array.isArray(parsedActivities) ? parsedActivities : []
        }

        if (profileRes.ok) {
          const profile = await profileRes.json()
          userLocalidade = profile?.Localidade || ''
        }
      }

      const subscribedIds = new Set(userData.map((evento) => Number(evento.id)))
      const organizerById = new Map(userData.map((evento) => [Number(evento.id), evento.nomeOrganizador]))

      const filtered = allEventos
        .filter((evento) => isNear(evento, userLocalidade))
        .map((evento) => ({
          ...evento,
          inscrito: subscribedIds.has(Number(evento.id)),
          nomeOrganizador: organizerById.get(Number(evento.id)) || evento.nomeOrganizador || 'Cozy Hearts'
        }))

      setEventos(filtered)
      setLocationHint(userLocalidade ? `A mostrar eventos perto de: ${userLocalidade}` : 'Sem localidade no perfil: a mostrar todos os eventos.')
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventosPerto()
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

      await fetchEventosPerto()
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

      await fetchEventosPerto()
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro ao cancelar inscrição')
    }
  }

  const formatarData = (dia_hora) => {
    if (!dia_hora) return ''
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
    if (evento.Localidade) {
      return `${evento.Localidade.Freguesia}, ${evento.Localidade.Cidade}`
    }
    return evento.Endereco || 'Local não especificado'
  }

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col">
        <Title name="Eventos perto de mim"/>
        <div className="px-4">
          {loading && <p>Carregando eventos...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && locationHint && <p className="text-sm text-text-light">{locationHint}</p>}
          {!loading && eventos.length === 0 && <p>Nenhum evento perto de você encontrado.</p>}
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

export default EventsNearMe
