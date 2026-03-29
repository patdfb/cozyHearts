import BigButton from '../../components/BigButton'
import { CircleUserRound, Lock, CalendarDays, Smile } from 'lucide-react'
import Input from '../../components/Input'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    setError('')

    if (!nome || !email || !dataNascimento || !senha) {
      setError('Todos os campos são obrigatórios.')
      return
    }

    try {
      console.log('Tentando registro com:', { nome, email, dataNascimento, senha: '***' })

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome,
          email,
          data_de_nascimento: dataNascimento,
          telemovel: '',
          password: senha
        })
      })

      console.log('Resposta do registro:', res.status, res.statusText)

      const data = await res.json()
      console.log('Dados do registro:', data)

      if (!res.ok) {
        setError(data.error || 'Erro no registro')
        return
      }

      alert('Conta criada com sucesso! Faça login.')
      navigate('/login')
    } catch (err) {
      console.error('Erro no registro:', err)
      setError('Erro de conexão. Verifique se o servidor backend está rodando.')
    }
  }

  return (
    <>
      <section id="center" className="grid min-h-dvh w-full place-items-center px-4">
        <div className="mx-auto flex w-fit flex-col gap-10 text-center">
          <Input
            icon={<Smile size={35} />}
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            icon={<CircleUserRound size={35} />}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={<CalendarDays size={35} />}
            placeholder="Data Nascimento"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            type="date"
          />
          <Input
            icon={<Lock size={35} />}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            type="password"
          />
          <BigButton name="Criar Conta" onClick={handleRegister} />
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </section>

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default Register
