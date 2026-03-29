import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TitleButtons from '../../components/TitleButtons'
import { ArrowLeft } from 'lucide-react'

function GroupDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [grupo, setGrupo] = useState(null)
  const [membros, setMembros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGrupoAndMembros = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth'))
        if (!authData || !authData.token) {
          setError('Não autenticado. Faça login primeiro.')
          setLoading(false)
          return
        }

        // Fetch group details and members
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/grupos/${id}/members`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authData.token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) {
          setError('Erro ao buscar dados do grupo')
          setLoading(false)
          return
        }

        const data = await res.json()
        setGrupo(data.atividade)
        setMembros(data.membros)
      } catch (err) {
        console.error('Erro:', err)
        setError('Erro de conexão com o servidor')
      } finally {
        setLoading(false)
      }
    }

    fetchGrupoAndMembros()
  }, [id])

  if (loading) return <div className="flex min-h-dvh w-full items-center justify-center">Carregando...</div>
  if (error) return <div className="text-red-500 p-4">{error}</div>
  if (!grupo) return <div className="p-4">Grupo não encontrado</div>

  return (
    <section id="center" className="flex min-h-dvh w-full flex-col">
      <TitleButtons />
      
      <div className="px-4 py-4">
        {/* Header com botão voltar */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-700 mb-4 hover:text-green-800"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        {/* Imagem grupo */}
        <img 
          src={grupo.Image || "https://i.ytimg.com/vi/uQd11N9pj5U/maxresdefault.jpg"} 
          alt={grupo.Nome}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />

        {/* Informações do grupo */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black mb-2">{grupo.Nome}</h1>
          
          {grupo.Interesse && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Categoria:</span> {grupo.Interesse.Nome}
            </p>
          )}
          
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Local:</span> {(() => {
              const endereco = grupo.Endereco || ''
              let localidade = ''
              
              if (grupo.Localidade && typeof grupo.Localidade === 'object' && !Array.isArray(grupo.Localidade)) {
                const freguesia = grupo.Localidade.Freguesia || ''
                const cidade = grupo.Localidade.Cidade || ''
                localidade = `${freguesia}${freguesia && cidade ? ', ' : ''}${cidade}`
              }
              
              if (Array.isArray(grupo.Localidade) && grupo.Localidade.length > 0) {
                const loc = grupo.Localidade[0]
                const freguesia = loc.Freguesia || ''
                const cidade = loc.Cidade || ''
                localidade = `${freguesia}${freguesia && cidade ? ', ' : ''}${cidade}`
              }
              
              if (endereco && localidade) {
                return `${endereco}, ${localidade}`
              }
              return endereco || localidade || 'Local não especificado'
            })()}
          </p>

          {grupo.Descricao && (
            <p className="text-sm text-gray-700">
              {grupo.Descricao}
            </p>
          )}
        </div>

        {/* Secção de membros */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3">
            Membros ({membros.length})
          </h2>
          
          {membros.length === 0 ? (
            <p className="text-gray-600">Nenhum membro neste grupo</p>
          ) : (
            <div className="space-y-3">
              {membros.map((membro) => (
                <div 
                  key={membro.id} 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {!membro.Organizador && membro.Usuario?.Image && (
                    <img 
                      src={membro.Usuario.Image} 
                      alt={membro.nomeExibicao || membro.Usuario?.Nome || 'Membro'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-black">
                      {membro.nomeExibicao || membro.Usuario?.Nome || 'Desconhecido'}
                      {membro.Organizador && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Organizador
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Secção de data e hora da atividade */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-bold text-black mb-2">Data e Hora</h2>
          {grupo.dia_hora ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Data:</span> {new Date(grupo.dia_hora).toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Hora:</span> {new Date(grupo.dia_hora).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Data não especificada</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default GroupDetails
