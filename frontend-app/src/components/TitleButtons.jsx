import Button from './Button'
import Title from './Title'
import { useLocation, useNavigate } from 'react-router-dom'

export default function TitleButtons() {

  const navigate = useNavigate()
  const { pathname } = useLocation()


  return (
    <div className="w-full flex flex-col">
        <Title name={"Os meus grupos e eventos"}/>
        <div className="flex flex-row justify-left px-4">
            <Button
              name="Grupos"
              selected={pathname === '/myGroups'}
              onClick={() => navigate('/myGroups')}
            />
            <Button
              name="Eventos"
              selected={pathname === '/myEvents'}
              onClick={() => navigate('/myEvents')}
            />
        </div>
    </div>

  )
}

