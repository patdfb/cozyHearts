import { useNavigate } from 'react-router-dom'
import TitleButtons from '../../components/TitleButtons'

function MyGroups() {
  const navigate = useNavigate()

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col">
        <TitleButtons/>
      </section>
    </>
  )
}

export default MyGroups
