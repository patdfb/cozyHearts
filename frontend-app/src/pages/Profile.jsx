import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'

const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem('cozy_hearts_auth') || 'null')
  } catch {
    return null
  }
}

const getInitialProfileFromStorage = () => {
  const authData = getStoredAuth()
  if (authData?.usuario) {
    return authData.usuario
  }

  try {
    return JSON.parse(localStorage.getItem('user_data') || 'null')
  } catch {
    return null
  }
}

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(getInitialProfileFromStorage())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authData = getStoredAuth()

        if (!authData?.token) {
          setLoading(false)
          setError('Sessao expirada. Inicie sessao novamente.')
          return
        }

        const response = await fetch('http://localhost:3000/usuarios/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          setError(data.error || 'Nao foi possivel carregar o perfil.')
          return
        }

        const data = await response.json()
        setProfile(data)
      } catch {
        setError('Erro de conexao ao carregar o perfil.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('cozy_hearts_auth')
    localStorage.removeItem('user_data')
    navigate('/login')
  }

  if (loading) {
    return (
      <section id="center" className="flex min-h-dvh w-full items-center justify-center">
        <p className="text-lg font-semibold text-text-light">A carregar perfil...</p>
      </section>
    )
  }

  return (
    <section id="center" className="flex min-h-dvh w-full flex-col pb-10">
      <Title name="O meu perfil" path="/main" />

      <div className="px-4">
        {error ? (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-left text-base text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-3 rounded-3xl bg-container p-5 text-left">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
              {profile?.Image ? (
                <img src={profile.Image} alt="Foto de perfil" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-2xl font-bold text-gray-500">
                  {(profile?.Nome || '?').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{profile?.Nome || 'Sem nome'}</p>
              <p className="text-base text-text-light">{profile?.Email || 'Sem email'}</p>
            </div>
          </div>

          <div className="space-y-4 text-base">
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-text-light">Telemovel</p>
              <p className="text-lg font-semibold text-black">{profile?.Telemovel || 'Nao definido'}</p>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-text-light">Data de nascimento</p>
              <p className="text-lg font-semibold text-black">{profile?.Data_de_Nascimento || 'Nao definida'}</p>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-text-light">Localidade</p>
              <p className="text-lg font-semibold text-black">{profile?.Localidade || 'Nao definida'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={() => navigate('/main')}
            className="h-12 rounded-4xl bg-button text-lg font-bold text-white hover:bg-button-selected"
          >
            Voltar ao menu
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="h-12 rounded-4xl bg-error text-lg font-bold text-white hover:opacity-95"
          >
            Terminar sessao
          </button>
        </div>
      </div>
    </section>
  )
}
