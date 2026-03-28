import { useState } from 'react'
import logoName from '../assets/logo_name.png'
import name from '../assets/name.png'
import logo from '../assets/logo.png'
import BigButton from '../components/BigButton'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div class="w-auto h-auto">
          <img src={logo} class="" />
            <div class="flex line- line-clamp-2">
              <BigButton name="Iniciar Sessão" onClick={print}/>  {/* trocar isto */}
              <BigButton name="Registar Conta" onClick={print}/>  {/* trocar isto */}
            </div>
        </div>
        </section>

      <div className="ticks"></div>


      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default Home
