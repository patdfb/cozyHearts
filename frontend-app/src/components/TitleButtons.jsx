import { ArrowLeft } from 'lucide-react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'

export default function TitleButtons() {

  const navigate = useNavigate()

  return (
    <div className="w-full flex flex-col">
        <div className="flex place-items-center flex-row justify-left gap-4 px-4 mt-7 mb-4">
            <ArrowLeft size={25}/>
            <p className="text-2xl font-bold">
                {"Os meus grupos e eventos"} 
            </p> 
        </div>
        <div className="flex flex-row justify-left">
            <Button name="Grupos" onClick={() => navigate('/myGroups')}/>
            <Button name="Eventos" onClick={() => navigate('/myEvents')}/>
        </div>

    </div>

  )
}

