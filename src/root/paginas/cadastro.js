import React, { useState } from 'react'
import { RiArrowLeftSLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import InputMask from 'react-input-mask'
import { isBrowser } from 'react-device-detect'

function Cadastro() {
    const navigate = useNavigate()
    const [erro, setErro] = useState('')
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        email: '',
        sexo: '',
        cpf: '',
        grau_ensino: '',
        data_nascimento: '',
    })

    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '')
    
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
    
        let soma = 0
        let resto
    
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i)
        resto = (soma * 10) % 11
        if (resto === 10 || resto === 11) resto = 0
        if (resto !== parseInt(cpf[9])) return false
    
        soma = 0
        
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i)
        resto = (soma * 10) % 11
        if (resto === 10 || resto === 11) resto = 0
        if (resto !== parseInt(cpf[10])) return false
    
        return true
    }

  const handleSubmit = async () => {
    if (!formData.username || !formData.password || !formData.first_name || !formData.email) {
      setErro('Preencha os campos obrigatórios.')
      return
    }

    if (formData.password.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    if (!validarCPF(formData.cpf)) {
      setErro('O CPF informado é inválido.')
      return
    }

    if (!formData.email.includes('@')) {
      setErro('Por favor, insira um email válido.')
      return
    }

    const camposPreenchidos = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => {
        if (key === 'username') {
          value = value.toLowerCase()
        }
        return value !== ''
      })
    )

    try {
      const response = await fetch('https://api.nero.lat/api/usuario/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(camposPreenchidos),
      })

      if (response.ok) {
        await handleLogin(camposPreenchidos.username, camposPreenchidos.password)
      } else {
        const errorData = await response.json()
        setErro(errorData.username || 'Erro ao realizar o cadastro.')
      }
    } catch (err) {
        console.error('Erro no cadastro:', err)
        setErro('Erro no servidor. Tente novamente mais tarde.')
    }
  }
  
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('https://api.nero.lat/api/api-token-auth/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('id', data.id)
        localStorage.setItem('tipo', data.tipo)
        navigate('/home')
      } else {
        setErro('Erro no login após cadastro.')
      }
    } catch (erro) {
      console.error('Erro na autenticação:', erro)
      setErro('Erro ao autenticar. Verifique suas credenciais.')
    }
  }

  const graudeEnsino = [
    { id: '7', text: 'Ensino Médio' },
    { id: '5', text: 'Ensino Fundamental' },
    { id: '9', text: 'Educação Superior' },
    { id: '8', text: 'Educação Superior Incompleta' },
    { id: '13', text: 'Doutorado' },
    { id: '12', text: 'Mestrado' },
    { id: '6', text: 'Ensino Médio Incompleto' },
    { id: '11', text: 'Pós-Graduação' },
    { id: '10', text: 'Pós-Graduação Incompleta' },
    { id: '4', text: '6º ao 9º Ano Fundamental Incompleto' },
    { id: '3', text: '5º Ano Fundamental' },
    { id: '2', text: 'Até o 5º Ano Fundamental Incompleto' },
    { id: '1', text: 'Analfabeto' },
  ]

  return (
    <div className={`flex flex-col h-screen ${isBrowser? 'w-[100%] mt-10' : 'w-[95%] ml-3'} `}>
      <form>
        <div className={`fixed top-0 flex items-center ${isBrowser? '' : '-ml-3'} bg-white w-screen min-h-12 text-xl font-semibold shadow-xl gap-2`}>
          <RiArrowLeftSLine className='ml-5' onClick={() => navigate(-1)} size={30} />
          <h1 className="shadow-2xl -mt-[2px] ml-3">Cadastro</h1>
        </div>

        <div className={`${isBrowser? 'px-[10%]' : ''}`}>
          <div className="mt-14">
            <h1 className="font-semibold flex">Usuário<p className='text-gray-500'>*</p></h1>
            <input
              type="text"
              name="username"
              className="input-generico w-full"
              placeholder="Escolha um usuário"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <h1 className="font-semibold flex">Senha<p className='text-gray-500'>*</p></h1>
            <input
              type="password"
              name="password"
              className="input-generico w-full"
              placeholder="Escolha uma senha"
              value={formData.password}
              onChange={handleChange}
            />
            <h1 className="-mt-2 text-xs text-gray-400">A senha deve ter pelo menos 8 caracteres</h1>
          </div>

          <div className="mt-2">
            <h1 className="font-semibold flex">Nome Completo<p className='text-gray-500'>*</p></h1>
            <input
              type="text"
              name="first_name"
              className="input-generico w-full"
              placeholder="Digite seu nome completo"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <h1 className="font-semibold flex">Email<p className='text-gray-500'>*</p></h1>
            <input
              type="email"
              name="email"
              className="input-generico w-full"
              placeholder="Digite seu endereço de email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
              <h1 className="font-semibold">CPF</h1>
              <InputMask
                  mask="999.999.999-99"
                  name="cpf"
                  className="input-generico w-full"
                  placeholder="Digite seu CPF"
                  value={formData.cpf}
                  onChange={handleChange}
              />
          </div>
          
          <div>
            <h1 className="font-semibold">Data de Nascimento</h1>
            <input
              type="date"
              name="data_nascimento"
              className="input-generico w-full"
              value={formData.data_nascimento}
              onChange={handleChange}
            />
          </div>

          <div>
            <h1 className="font-semibold">Sexo</h1>
            <div className="flex gap-2">
              {['Masculino', 'Feminino', 'Prefiro não Informar'].map((sexo, index) => (
                <button
                  key={index}
                  type="button"
                  className={`botao-estilo-5 ${
                    formData.sexo === sexo[0].toLowerCase() ? 'bg-gray-300' : 'bg-[#F4F4F4]'
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, sexo: sexo[0].toLowerCase() }))}
                > 
                  {sexo}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
      <div className={`${isBrowser? 'px-[10%]' : ''}`}>
        <div>
          <h1 className="font-semibold">Grau de Ensino</h1>
          <div className="flex overflow-auto gap-2">
            {graudeEnsino.map((item) => (
              <button 
                key={item.id}
                className={`botao-estilo-5 mb-2 ${
                  formData.grau_ensino === item.id ? 'bg-gray-300' : 'bg-[#F4F4F4]'
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, grau_ensino: item.id }))}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>

        {erro && (
          <p className="text-red-500 text-sm mt-2">
            {erro}
          </p>
        )}

        <div className={`${isBrowser? 'flex flex-col w-full items-center justify-center' : ''}`}>
          <div className={`flex flex-col justify-around gap-2 mt-4 ${isBrowser? 'w-72' : 'w-full'}`}>
            <button className="botao-estilo-1" onClick={handleSubmit}>
              Concluir Cadastro Mais Tarde
            </button>
            <button className="botao-estilo-2" onClick={handleSubmit}>
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cadastro