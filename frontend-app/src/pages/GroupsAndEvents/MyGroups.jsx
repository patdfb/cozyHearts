import { useNavigate } from 'react-router-dom'
import TitleButtons from '../../components/TitleButtons'
import GroupCard from '../../components/GroupCard'

function MyGroups() {
  const navigate = useNavigate()

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col">
        <TitleButtons/>
        <div className="px-4">
          <GroupCard name={"Teste"} photo={"https://i.ytimg.com/vi/uQd11N9pj5U/maxresdefault.jpg"} onClick={() => {}}/> {/* TO DO ligar ao backend, fazer uma especie de map que mostra todos os grupos do usuário */}
        </div>
      </section>
    </>
  )
}

export default MyGroups
