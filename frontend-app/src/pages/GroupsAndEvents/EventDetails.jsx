import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Heart, User } from 'lucide-react'

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

  if (loading) return <section id="center" className="flex min-h-dvh w-full items-center justify-center"><p className="text-lg">Carregando...</p></section>
  if (pageError) return <section id="center" className="flex min-h-dvh w-full items-center justify-center"><p className="text-lg text-red-500">{pageError}</p></section>
  if (!evento) return <section id="center" className="flex min-h-dvh w-full items-center justify-center"><p className="text-lg">Evento não encontrado</p></section>

  return (
    <section id="center" className="relative flex min-h-dvh w-full flex-col pb-28">
      {/* Imagem do evento - no topo */}
      {evento.Image && (
        <div className="w-full h-48 rounded-b-2xl overflow-hidden shadow-md">
          <img 
            src={evento.Image} 
            alt={evento.Nome}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="px-6 py-8 flex-1">

        {/* Título e Badge */}
        <h1 className="mb-3 text-4xl font-bold text-black">
          {evento.Nome}
        </h1>
        
        {evento.Interesse && (
          <div className="mb-6 inline-block px-4 py-2 bg-purple-100 rounded-full text-base font-semibold text-purple-700">
            {evento.Interesse.Nome}
          </div>
        )}

        {/* Informações em cards simples */}
        <div className="space-y-3 mb-6 text-base">
          <p className="text-gray-700">
            <span className="font-semibold text-black">Data:</span> {formatarData(evento.dia_hora)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold text-black">Hora:</span> {formatarHora(evento.dia_hora)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold text-black">Local:</span> {obterLocal(evento)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold text-black">Organizador:</span> {evento.nomeOrganizador || 'Cozy Hearts'}
          </p>
        </div>

        {/* Descrição */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="mb-2 font-bold text-lg text-black">Sobre o Evento</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            {evento.Descricao || 'Sem descrição disponível'}
          </p>
        </div>

        {/* Erro */}
        {actionError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-base">
            {actionError}
          </div>
        )}
      </div>

      {/* Botões fixos na base */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white px-4 py-5">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-12 flex-1 rounded-4xl bg-gray-200 text-gray-800 text-base font-bold hover:bg-gray-300 transition-colors"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleSubscription}
            disabled={isActionLoading}
            className={`h-12 flex-1 rounded-4xl text-base font-bold text-white transition-all ${
              isSubscribed 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-600 hover:bg-green-700'
            } ${isActionLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isActionLoading
              ? 'A processar...'
              : isSubscribed
                ? 'Cancelar Inscrição'
                : 'Inscrever-me'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default EventDetails