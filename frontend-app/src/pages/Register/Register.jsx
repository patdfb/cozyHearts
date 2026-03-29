import BigButton from '../../components/BigButton'
import { CircleUserRound, Lock, CalendarDays, Smile, House, Building2 } from 'lucide-react'
import Input from '../../components/Input'
import Title from '../../components/Title'

function Register() {
  return (
    <section id="center" className="flex min-h-dvh w-full flex-col">
      <Title name="Criar conta" path="/register-choice" />
      <section className="grid w-full flex-1 place-items-center px-4 pb-6">
        <div className="mx-auto flex w-fit flex-col gap-10 text-center">
          <Input icon={<Smile size={35}/>} placeholder="Nome" />
          <Input icon={<CircleUserRound size={35}/>} placeholder="Email/Telefone" />
          <Input icon={<CalendarDays size={35}/>} placeholder="Data Nascimento" /> {/* TO DO colocar calendario pra escolha de data*/}
          <Input icon={<House size={35}/>} placeholder="Morada" />
          <Input icon={<Building2 size={35}/>} placeholder="Localidade" />
          <Input icon={<Lock size={35}/>} placeholder="Senha" type="password" />
          <BigButton name="Criar Conta" onClick={""}/> {/* onClick={ lógica de criar conta } */}
        </div>
      </section>
    </section>
  )
}

export default Register
