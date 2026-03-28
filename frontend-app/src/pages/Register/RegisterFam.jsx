import BigButton from '../../components/BigButton'
import { useNavigate } from 'react-router-dom'
import { CircleUserRound, Lock } from 'lucide-react'
import Input from '../../components/Input'

function RegisterFam() {
  const navigate = useNavigate()

  return (
    <>
      <section id="center" className="grid min-h-dvh w-full place-items-center px-4">
        <div className="mx-auto flex w-fit flex-col gap-10 text-center">
            <p className='text-3xl text-black font-bold'> Quem está a criar conta?</p>
            <Input icon={<CircleUserRound size={35}/>} placeholder="Email/Telefone" />
            <Input icon={<Lock size={35}/>} placeholder="Senha" />
            <BigButton name="Entrar" onClick={""}/> {/* onClick={ lógica de login} */}
            <p className="underline text-l" onClick={() => navigate('/login')}>
                {"Clique aqui caso não se lembre da senha"}
            </p> 
        </div>
      </section>

      <div className="ticks"></div>


      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default RegisterFam
