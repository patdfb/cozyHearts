import { useNavigate } from 'react-router-dom'
import Title from '../../components/Title'
import InterestCard from '../../components/InterestCard'
import Button from '../../components/Button'

function OtherInterests() {
  const navigate = useNavigate()

  return (
    <>
      <section id="center" className="flex min-h-dvh w-full flex-col pb-24">
        <Title name={"Outros interesses"} path="/myInterests"/>
        <div className="px-4">
            <InterestCard name={"Teste"} photo={"https://i.ytimg.com/vi/uQd11N9pj5U/maxresdefault.jpg"} description="descrição do interesse aka ligar ao backend, siga loren " exclude={false} onClick={() => {}}/>
            <InterestCard name={"Teste2"} photo={"https://i.ytimg.com/vi/uQd11N9pj5U/maxresdefault.jpg"} description="descrição do interesse aka ligar ao backend, siga loren " exclude={false} onClick={() => {}}/>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white px-4 pb-4 pt-3">
        </div>
      </section>
    </>
  )
}

export default OtherInterests
