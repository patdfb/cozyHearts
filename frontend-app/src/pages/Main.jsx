import BigButton from '../components/BigButton'
import { useNavigate } from 'react-router-dom'
import ProfileFooter from '../components/ProfileFooter'

function Main() {
  const navigate = useNavigate()

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 px-4 text-center">
                <p className="text-5xl font-bold">
                    {"Bom Dia, Felipe"} {/* TO DO alta trocar hora do dia "boa tarde", "bom dia", "boa noite"; e ligar nome de usuário com backend */}
                </p> 
                <BigButton name="Grupos e eventos" onClick={() => navigate('/groups-events')}/> {/* onClick={ lógica de login} */}
                <BigButton name="Interesses" onClick={() => navigate('/interests')}/> {/* onClick={lógica de login} */}
                <BigButton name="Perto de mim" onClick={() => navigate('/near-me')} />
                <BigButton name="Ajuda" onClick={() => navigate('/help')} />
            </div>
            <ProfileFooter/>
        </section>
    </>
  )
}

export default Main
