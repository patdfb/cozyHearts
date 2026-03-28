import logo from '../assets/logo.png'
import BigButton from '../components/BigButton'
import { useNavigate } from 'react-router-dom'

function Main() {
  const navigate = useNavigate()

  return (
    <>
      <section id="center" className="grid min-h-dvh w-full place-items-center px-4">
        <div className="mx-auto flex w-fit flex-col gap-10 text-center">
            <BigButton name="Grupos e eventos" onClick={() => navigate('/groups-events')}/> {/* onClick={ lógica de login} */}
            <BigButton name="Interesses" onClick={() => navigate('/interests')}/> {/* onClick={ lógica de login} */}
            <BigButton name="Perto de mim" onClick={() => navigate('/near-me')} />
            <BigButton name="Ajuda" onClick={() => navigate('/help')} />
        </div>
      </section>
    </>
  )
}

export default Main
