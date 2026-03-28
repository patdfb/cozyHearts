import BigButton from '../../components/BigButton'
import { useNavigate } from 'react-router-dom'
import { CircleUserRound, Lock } from 'lucide-react'
import Input from '../../components/Input'

function RegisterChoice() {
  const navigate = useNavigate()

  return (
    <>
      <section id="center" className="grid min-h-dvh w-full place-items-center px-4">
        <div className="mx-auto flex w-fit flex-col gap-10 text-center">
            <p className='text-3xl text-black font-bold'> Quem está a criar conta?</p>
            <BigButton name="O próprio" onClick={() => navigate('/register')}/> {/* onClick={ lógica de login} */}
            <BigButton name="Um familiar / outro" onClick={() => navigate('/register-fam')}/> {/* onClick={ lógica de login} */}

        </div>
      </section>
    </>
  )
}

export default RegisterChoice
