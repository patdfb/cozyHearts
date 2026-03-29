import BigButton from '../../components/BigButton'
import { useNavigate } from 'react-router-dom'
import { CircleUserRound, Lock } from 'lucide-react'
import Input from '../../components/Input'
import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')

    if (!email || !password) {
      setError('Por favor, preencha email e senha.')
      return
    }

    try {
      console.log('Tentando login com:', { email, password: '***' })

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      console.log('Resposta recebida:', res.status, res.statusText)

      const data = await res.json()
      console.log('Dados da resposta:', data)

      if (!res.ok) {
        setError(data.error || 'Erro no login')
        return
      }

      const authData = { token: data.token, usuario: data.usuario }
      localStorage.setItem('cozy_hearts_auth', JSON.stringify(authData))
      navigate('/main')
    } catch (err) {
      console.error('Erro no fetch:', err)
      setError('Erro de conexão. Verifique se o servidor backend está rodando.')
    }
  }

  return (
    <>
      <section id="center" className="grid min-h-dvh w-full place-items-center px-4">
        <div className="mx-auto flex w-fit flex-col gap-10 text-center">
          <Input
            icon={<CircleUserRound size={35} />}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={<Lock size={35} />}
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <BigButton name="Entrar" onClick={handleLogin} />
          {error ? <p className="text-red-500">{error}</p> : null}
          <p className="underline text-l" onClick={() => navigate('/login')}>
            {'Clique aqui caso não se lembre da senha'}
          </p>
        </div>
      </section>

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default Login
