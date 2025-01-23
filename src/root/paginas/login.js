import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isBrowser } from 'react-device-detect'
import CircularProgress from '@mui/material/CircularProgress'

function Login() {
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erroLogin, setErroLogin] = useState(false)
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.clear()
  },[])

  const handleLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://api.nero.lat/api/api-token-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: login,
          password: senha,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('id', data.id)
        localStorage.setItem('tipo', data.tipo)
        navigate('/home')
      } else {
        setErroLogin(true)
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      setErroLogin(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen w-screen'>
      <div
        className={`flex flex-col items-center max-h-[90%] max-w-[90%] ${
          isBrowser ? 'min-w-[40%] min-h-[50%] justify-center' : 'min-w-[80%]'
        }`}
      >
        <img className='mb-10' src='/images/nero-logo com fundo.png'></img>
        <div className='w-[90%]'>
          <h1 className='font-semibold'>Usuário</h1>
          <input
            type='email'
            className='input-generico w-full'
            placeholder='Entre com seu nome de usuário'
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
          {erroLogin && <p className='text-red-500 text-sm'>Login ou Senha incorretos.</p>}
        </div>
        <div className='flex justify-around gap-2 mt-1 w-[90%]'>
          <button
            onClick={() => navigate('/cadastro')}
            className='botao-estilo-1'
          >
            Cadastrar
          </button>
          <button
            onClick={handleLogin}
            className={`botao-estilo-2 ${shake ? 'shake' : ''}`}
            disabled={loading}
          >
            {loading ? <CircularProgress sx={{mb: -0.5}} size={20} color="inherit"/> : 'Log In'}
          </button>
        </div>
        <h1 className='mt-3 text-sm text-gray-400 cursor-pointer'>Esqueceu sua senha?</h1>
      </div>
    </div>
  )
}

export default Login