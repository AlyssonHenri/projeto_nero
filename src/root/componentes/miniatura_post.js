import React, { useEffect, useState } from 'react'
import { isBrowser } from 'react-device-detect'
import { useNavigate } from 'react-router-dom'

function Miniatura({ id, usuario, tipo, titulo, status, imagem, perfil, criacao, votos, descricao, natureza }) {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [perfilData, setPerfilData] = useState(null)
    const tipoCor = {
        1: 'bg-blue-500',
        2: 'bg-yellow-500',
        3: 'bg-green-500',
        4: 'bg-brown-500',
        5: 'bg-gray-500',
        6: 'bg-gray-200'
    }
    const tipoTexto = {
        1: 'Infraestrutura',
        2: 'Iluminacao',
        3: 'Coleta de lixo',
        4: 'Saneamento',
        5: 'Trânsito',
        6: 'Outros'
    }

    const fetchPerfilData = async () => {
        console.log(`https://api.nero.lat/api/usuario/${perfil}/`)
        try {
            const response = await fetch(`https://api.nero.lat/api/usuario/${perfil}/`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            })
            const data = await response.json()
            setPerfilData(data)
        } catch (error) {
            console.error('Erro ao buscar os dados do perfil:', error)
        }
    }

    useEffect(() => {
        fetchPerfilData()
    }, [])

    const corDeFundo = tipoCor[tipo] || 'bg-gray-500'
    const textoTipo = tipoTexto[tipo] || 'Desconhecido'

    const dataCriacao = new Date(criacao)
    const data = dataCriacao.toLocaleDateString()
    const hora = dataCriacao.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const statusInfo = {
        1: { emoji: '🔴', texto: 'Pendente' },
        2: { emoji: '🟢', texto: 'Resolvido' },
        3: { emoji: '⚠️', texto: 'Cancelada' } // Adicionando o status "Cancelada"
    }

    // Acessa diretamente statusInfo[status] e usa statusInfo[1] como fallback
    const { emoji, texto } = statusInfo[status] || statusInfo[1]

    const fotoPerfil = perfilData?.foto_perfil ? `https://api.nero.lat/${perfilData.foto_perfil}` : '/images/sem-foto.png'
    const nomePerfil = perfilData?.first_name || 'Anônimo'

    return (
       <>
         {isBrowser ? (
            <div className='relative shadow flex flex-col min-w-[24%] max-w-[24%] h-96'>
                <div className={`relative w-full h-full`}>
                    <img
                        alt={`Imagem de ${usuario}`}
                        src={imagem ? `https://api.nero.lat/${imagem}` : '/images/sem-imagem.png'}
                        className='w-full h-[350px] object-cover rounded-t-lg rounded-ss-xl overflow-hidden'
                    />
                    <h1 className={`absolute ${corDeFundo} p-1 rounded-ss-lg rounded-ee-lg text-white top-0 text-sm`}>
                        {textoTipo}
                    </h1>
                </div>
                <div className='bg-white absolute bottom-0 w-full px-3 flex flex-col font-semibold rounded-b-lg'>
                    <h1 className='text-sm mt-1 truncate'>{titulo}</h1>
                    <div className='flex items-center mb-1'>
                        <h1>{emoji}</h1>
                        <h1 className='ml-1'>{texto}</h1>
                    </div>
                </div>
            </div>
        ) : (
            <div onClick={() => { navigate(`/post/${id}`, { state: { id, titulo, usuario, status, imagem, fotoPerfil, nomePerfil, data, hora, votos, descricao, natureza }}) }} className='relative flex flex-col min-w-[48%] max-w-[48%] h-48'>
                <div className={`relative w-full h-full`}>
                    <img
                        alt={`Imagem de ${usuario}`}
                        src={imagem ? `https://api.nero.lat/${imagem}` : '/images/sem-imagem.png'}
                        className='w-full h-[150px] object-cover rounded-t-lg rounded-ss-xl overflow-hidden'
                    />
                    <h1 className={`absolute ${corDeFundo} p-1 rounded-ss-lg rounded-ee-lg text-white top-0 text-sm`}>
                        {textoTipo}
                    </h1>
                </div>
                <div className='bg-white absolute bottom-0 w-full px-3 flex flex-col font-semibold rounded-b-lg'>
                    <h1 className='text-sm mt-1 truncate'>{titulo}</h1>
                    <div className='flex items-center mb-1'>
                        <h1>{emoji}</h1>
                        <h1 className='ml-1'>{texto}</h1>
                    </div>
                </div>
            </div>
        )}
       </>
    )
}

export default Miniatura