import { CircleUserRound, Mail, Phone, MapPin, Pencil, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'

function Profile(nome, membro, email, telemovel, localidade, ) {
  const navigate = useNavigate()

  return (
    <section id="center" className="flex min-h-dvh w-full flex-col bg-background">
      <Title name="O meu perfil" path="/main" />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 pb-8 pt-2">
        <div className="flex flex-col items-center rounded-3xl bg-container p-6 text-center">
          <CircleUserRound size={92} className="mb-3 text-button-selected" />
          <p className="text-3xl font-bold text-black">Felipe Siqueira</p> {/* TO DO -  trocar para as infos do backend */}
          <p className="text-lg text-text-light">Membro desde março de 2026</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="mb-4 flex items-center gap-3 text-text-light">
            <Mail size={20} />
            <p className="text-left text-lg">felipe@email.com</p>
          </div>
          <div className="mb-4 flex items-center gap-3 text-text-light">
            <Phone size={20} />
            <p className="text-left text-lg">+351 912 345 678</p>
          </div>
          <div className="flex items-center gap-3 text-text-light">
            <MapPin size={20} />
            <p className="text-left text-lg">Porto</p>
          </div>
        </div>

        <button
          type="button"
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-4xl bg-button text-lg font-bold text-white"
          onClick={() => {}}
        >
          <Pencil size={18} />
          Editar perfil
        </button> {/* TO DO - acho que podemos deixar isto por fazer */}

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-4xl bg-error text-lg font-bold text-white"
          onClick={() => navigate('/login')}
        >
          <LogOut size={18} />
          Terminar sessão
        </button>
      </div>
    </section>
  )
}

export default Profile