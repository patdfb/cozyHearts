import logo from '../assets/logo.png'
import BigButton from '../components/BigButton'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <>
      <section id="center" className="grid min-h-dvh w-full place-items-center px-4">
        <div className="mx-auto flex w-fit flex-col gap-10 text-center">
          <img src={logo} alt="CozyHearts Logo" />
          <BigButton name="Iniciar Sessão" onClick={() => navigate('/login')} />
          <BigButton name="Registar Conta" onClick={() => navigate('/register-choice')} />
        </div>
      </section>

      <div className="ticks"></div>


      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default Home
