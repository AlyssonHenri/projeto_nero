import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'

function Login() {
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erroLogin, setErroLogin] = useState(false)
  const [shake, setShake] = useState(false)

  const mockUser = {
    email: 'usuario@exemplo.com',
    senha: '123',
  }

  const handleLogin = () => {
    if (login === mockUser.email && senha === mockUser.senha) {
      navigate('/home')
    } else {
      setErroLogin(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen w-screen'>
      <div
        className={`flex flex-col items-center max-h-[90%] max-w-[90%] ${
          isBrowser ? 'min-w-[40%] min-h-[50%] justify-center' : 'min-w-[80%]'
        }`}
      >
        <h1 className='text-[50px] font-semibold sombraT mb-10'>Nero</h1>
        <div className='w-[90%]'>
          <h1 className='font-semibold'>Email</h1>
          <input
            type='email'
            className='input-generico w-full'
            placeholder='Entre com seu e-mail'
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div className='w-[90%] -mt-1'>
          <h1 className='font-semibold'>Senha</h1>
          <input
            type='password'
            className='input-generico w-full'
            placeholder='Digite sua senha'
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erroLogin && <p className='text-red-500 text-sm'>Email ou senha incorretos.</p>}
        </div>
        <div className='flex justify-around gap-2 mt-1 w-[90%]'>
          <button className='botao-estilo-1'>Cadastrar</button>
          <button
            onClick={handleLogin}
            className={`botao-estilo-2 ${shake ? 'shake' : ''}`}
          >
            Log In
          </button>
        </div>
        <h1 className='mt-3 text-sm text-gray-400 cursor-pointer'>Esqueceu sua senha?</h1>
      </div>
    </div>
  )
}

export default Login