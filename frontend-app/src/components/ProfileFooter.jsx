import { CircleUserRound, Lock } from 'lucide-react'

import { useNavigate } from 'react-router-dom'

export default function ProfileFooter() {

  const navigate = useNavigate()

  return (
    <footer className="h-16 flex justify-left gap-4 p-4 place-items-center text-white bg-background-footer"
            onClick={() => navigate('/profile')}
    >
      <CircleUserRound size={35}/>
      <p className="text-xl font-bold">
          {"O meu perfil"}
      </p> 
    </footer>
  )
}

