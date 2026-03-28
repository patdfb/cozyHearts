import BigButton from '../../components/BigButton'
import { useNavigate } from 'react-router-dom'
import { CircleUserRound, Lock, CalendarDays, Smile } from 'lucide-react'
import Input from '../../components/Input'

function Register() {
  const navigate = useNavigate()

  return (
    <>
      <section id="center" className="grid min-h-dvh w-full place-items-center px-4">
        <div className="mx-auto flex w-fit flex-col gap-10 text-center">
            <Input icon={<Smile size={35}/>} placeholder="Nome" />
			<Input icon={<CircleUserRound size={35}/>} placeholder="Email/Telefone" />
            <Input icon={<CalendarDays size={35}/>} placeholder="Data Nascimento" /> {/* TO DO colocar calendario pra escolha de data*/}
            <Input icon={<Lock size={35}/>} placeholder="Senha" /> {/* TO DO esconder palavra passe e colocar "mostrar senha */}
            <BigButton name="Criar Conta" onClick={""}/> {/* onClick={ lógica de criar conta } */}
        </div>
      </section>

      <div className="ticks"></div>


      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default Register
