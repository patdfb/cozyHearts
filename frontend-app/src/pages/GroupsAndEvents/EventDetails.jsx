import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Title from '../../components/Title'

function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [actionError, setActionError] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setPageError('')
        const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth') || 'null')

        const eventoRes = await fetch(`http://localhost:3000/atividades/${id}`)
        if (!eventoRes.ok) {
          setPageError('Evento não encontrado')
          return
        }

        const eventoData = await eventoRes.json()
        setEvento(eventoData)

        if (authData?.token) {
          const activitiesRes = await fetch('http://localhost:3000/usuarios/activities', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authData.token}`,
              'Content-Type': 'application/json'
            }
          })

          if (activitiesRes.ok) {
            const activities = await activitiesRes.json()
            const subscribed = Array.isArray(activities)
              ? activities.some((item) => Number(item.id) === Number(id))
              : false
            setIsSubscribed(subscribed)
          } else {
            setIsSubscribed(false)
          }
        } else {
          setIsSubscribed(false)
        }
      } catch (err) {
        console.error('Erro:', err)
        setPageError('Erro ao carregar evento')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchEvento()
  }, [id])

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

  const handleSubscription = async () => {
    try {
      setActionError('')
      setIsActionLoading(true)
      const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth') || 'null')
      if (!authData?.token) {
        setActionError('Faça login para gerir a inscrição.')
        return
      }

      const endpoint = isSubscribed ? 'leave' : 'join'
      const res = await fetch(`http://localhost:3000/atividades/${id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {
        setIsSubscribed((prev) => !prev)
      } else {
        const data = await res.json().catch(() => ({}))
        setActionError(data.error || 'Erro ao atualizar inscrição')
      }
    } catch (err) {
      console.error('Erro:', err)
      setActionError('Erro de conexão')
    } finally {
      setIsActionLoading(false)
    }
  }

  if (loading) return <section id="center" className="flex min-h-dvh w-full flex-col"><p>Carregando...</p></section>
  if (pageError) return <section id="center" className="flex min-h-dvh w-full flex-col"><p className="text-red-500">{pageError}</p></section>
  if (!evento) return <section id="center" className="flex min-h-dvh w-full flex-col"><p>Evento não encontrado</p></section>

  return (
    <section id="center" className="relative flex min-h-dvh w-full flex-col pb-24">
      <Title name="Mais Detalhes" path="/myEvents" />

      <div className="px-4 pb-6 text-left text-text-light">
        <h1 className="mb-4 text-3xl font-bold leading-tight text-black">
          {evento.Nome}
        </h1>

        <div className="mb-6 space-y-1 text-base">
          <p>
            <span className="font-semibold">Dia:</span> {formatarData(evento.dia_hora)}
          </p>
          <p>
            <span className="font-semibold">Hora:</span> {formatarHora(evento.dia_hora)}
          </p>
          <p>
            <span className="font-semibold">Local:</span> {obterLocal(evento)}
          </p>
          <p>
            <span className="font-semibold">Interesse:</span> {evento.Interesse?.Nome || 'Não especificado'}
          </p>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-black">Descrição</h2>
        <p className="mb-4 text-base leading-relaxed">
          {evento.Descricao || 'Sem descrição'}
        </p>
        {actionError ? <p className="text-red-500">{actionError}</p> : null}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t-4 border-button bg-background px-4 pb-4 pt-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/myEvents')}
            className="h-10 w-full rounded-4xl bg-button text-sm font-bold text-white"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleSubscription}
            disabled={isActionLoading}
            className={`h-10 w-full rounded-4xl text-sm font-bold text-white ${isSubscribed ? 'bg-error' : 'bg-button'} ${isActionLoading ? 'opacity-70' : ''}`}
          >
            {isActionLoading
              ? 'A processar...'
              : isSubscribed
                ? 'Cancelar Inscrição'
                : 'Inscrever'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default EventDetails