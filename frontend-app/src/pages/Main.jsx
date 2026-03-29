import BigButton from '../components/BigButton'
import { useNavigate } from 'react-router-dom'
import ProfileFooter from '../components/ProfileFooter'

const greetingByHour = (hour) => {
  if (hour >= 6 && hour < 12) return 'Bom dia'
  if (hour >= 12 && hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

const firstName = (name = '') => {
  if (!name) return ''
  return name.trim().split(' ')[0]
}

function Main() {
  const navigate = useNavigate()

  let displayName = 'Usuário'
  let displayGreeting = 'Olá'

  try {
    const auth = JSON.parse(localStorage.getItem('cozy_hearts_auth') || 'null')
    if (auth?.usuario?.Nome) {
      displayName = firstName(auth.usuario.Nome)
      displayGreeting = greetingByHour(new Date().getHours())
    }
  } catch (e) {
    console.warn('Erro ao ler usuário localStorage', e)
  }

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
