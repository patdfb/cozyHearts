import { useNavigate } from "react-router-dom"
import { ArrowLeft } from 'lucide-react'

export default function Title({ name }) {

    const navigate = useNavigate()
    const handleGoBack = () => navigate('/main')

    return(

        <div className="flex place-items-center flex-row justify-left gap-4 px-4 mt-7 mb-4">
            <button
            type="button"
            onClick={handleGoBack}
            aria-label="Voltar"
            className="cursor-pointer"
            >
                <ArrowLeft size={25} className='text-black'/>
            </button>
            <p className="text-black text-2xl font-bold">
                {name} 
            </p> 
        </div>
    )
}