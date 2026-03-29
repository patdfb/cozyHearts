import BigButton from '../components/BigButton'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileFooter from '../components/ProfileFooter'

const greetingByHour = (hour) => {
  if (hour >= 7 && hour < 12) return 'Bom dia'
  if (hour >= 12 && hour < 19) return 'Boa tarde'
  return 'Boa noite'
}

const firstName = (name = '') => {
  if (!name) return ''
  return name.trim().split(' ')[0]
}

const normalizeName = (name = '') => {
  const cleaned = String(name || '').trim()
  if (!cleaned) return ''
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase()
}

const getNomeLocal = () => {
  try {
    const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth') || '{}')
    if (authData?.usuario?.Nome) return normalizeName(firstName(authData.usuario.Nome))
  } catch {
    // no-op
  }
  return 'Pessoa'
}

function Main() {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(getNomeLocal)
  const displayGreeting = greetingByHour(new Date().getHours())

  useEffect(() => {
    const fetchNomeDoUsuario = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('cozy_hearts_auth') || '{}')

        if (!authData?.token) {
          setDisplayName(getNomeLocal())
          return
        }

        // O backend resolve o usuario usando o email do token e procura na tabela Usuario
        const response = await fetch('http://localhost:3000/usuarios/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          setDisplayName(getNomeLocal())
          return
        }

        const profile = await response.json()
        const nome = profile?.Nome ? normalizeName(firstName(profile.Nome)) : getNomeLocal()
        setDisplayName(nome)
      } catch (e) {
        console.warn('Erro ao buscar nome no perfil', e)
        setDisplayName(getNomeLocal())
      }
    }

    fetchNomeDoUsuario()
  }, [])

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 px-4 text-center">
          <p className="text-5xl font-bold">
            {`${displayGreeting}, ${displayName}`}
          </p>
          <BigButton name="Grupos e eventos" onClick={() => navigate('/myGroups')} />
          <BigButton name="Interesses" onClick={() => navigate('/myInterests')} />
          <BigButton name="Perto de mim" onClick={() => navigate('/eventsNearMe')} />
          <BigButton name="Ajuda" onClick={() => navigate('/help')} />
        </div>
        <ProfileFooter />
      </section>
    </>
  )
}

export default Main
