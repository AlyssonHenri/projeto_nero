import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NovoPost() {
    const navigate = useNavigate()
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({
        titulo: '',
        descricao : '',
        imagem: '',
        geolocalizacao: '',
        natureza: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        }))
    }

  const natureza = [
    { id: '1', text: 'Ensino Infraestrutura' },
    { id: '2', text: 'Iluminação' },
    { id: '3', text: 'Coleta de Lixo' },
    { id: '4', text: 'Saneamento' },
    { id: '4', text: 'Transito' },
    { id: '4', text: 'Outro' },
  ]

  return (
    <div className="flex flex-col h-screen w-[95%] ml-3">
      <div className="fixed top-0 flex items-center -ml-3 bg-white w-screen min-h-12 text-xl font-semibold shadow-xl gap-2">
        <h1 className="shadow-2xl -mt-[2px] ml-3">Detalhes da Postagem </h1>
      </div>

      <div className="mt-14">
        <h1 className="font-semibold">Usuário</h1>
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
        <h1 className="font-semibold">Senha</h1>
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
        <h1 className="font-semibold">Nome Completo</h1>
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
        <h1 className="font-semibold">Email</h1>
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
        <input
          type="text"
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

      <div>
        <h1 className="font-semibold">Grau de Ensino</h1>
        <div className="flex overflow-auto gap-2">
          {natureza.map((item) => (
            <button
              key={item.id}
              className={`botao-estilo-5 ${
                formData.grau_ensino === item.id ? 'bg-gray-300' : 'bg-[#F4F4F4]'
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, grau_ensino: item.id }))}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          Preencha os campos obrigatórios corretamente.
        </p>
      )}

      <div className="flex flex-col justify-around gap-2 mt-4 w-full">
        <button className="botao-estilo-1">
          Concluir Cadastro Mais Tarde
        </button>
        <button className="botao-estilo-2">
          Concluir
        </button>
      </div>
    </div>
  )
}

export default NovoPost