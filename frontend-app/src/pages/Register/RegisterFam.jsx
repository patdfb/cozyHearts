import BigButton from '../../components/BigButton'
import { useNavigate } from 'react-router-dom'
import { CircleUserRound, Lock } from 'lucide-react'
import Input from '../../components/Input'
import Title from '../../components/Title'

function RegisterFam() {
  const navigate = useNavigate()

  return (
    <section id="center" className="flex min-h-dvh w-full flex-col">
      <Title name="Quem está a criar conta?" path="/register-choice" />
      <section className="grid w-full flex-1 place-items-center px-4 pb-6">
        <div className="mx-auto flex w-fit flex-col gap-10 text-center">
            <Input icon={<CircleUserRound size={35}/>} placeholder="Email/Telefone" />
            <Input icon={<Lock size={35}/>} placeholder="Senha" type="password" />
            <BigButton name="Entrar" onClick={""}/> {/* onClick={ lógica de login} */}
            <p className="underline text-l" onClick={() => navigate('/login')}>
                {"Clique aqui caso não se lembre da senha"}
            </p> 
        </div>
      </section>
    </section>
  )
}

export default RegisterFam
