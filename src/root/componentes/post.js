import React, { useEffect, useState } from 'react'
import { PiSirenDuotone } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

function Post({ id, nome, status, imagem, perfil, criacao, votos, descricao, natureza }) {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [perfilData, setPerfilData] = useState(null)
    const statusInfo = {
        pendente: { emoji: '🔴', texto: 'Pendente' },
        resolvido: { emoji: '🟢', texto: 'Resolvido' }
    }

    const { emoji, texto } = statusInfo[status?.toLowerCase()] || statusInfo.pendente

    const fetchPerfilData = async () => {
        try {
            const response = await fetch(`http://18.228.8.220:8000/api/usuario/${perfil}/`, {
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

    const dataCriacao = new Date(criacao)
    const data = dataCriacao.toLocaleDateString()
    const hora = dataCriacao.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // função para calcular a quantidade de estrelas baseado nos votos tá aqui de tapa buraco mesmo enquanto n tem uma que preste
    const calcularEstrelas = (votos) => {
        const maxVotos = 100 
        const estrelas = Math.min(Math.floor((votos / maxVotos) * 5), 5)
        return estrelas
    }

    const estrelas = calcularEstrelas(votos)

    const renderStars = (rating) => {
        const max = 5
        const cheias = Math.min(rating, max)
        const vazias = max - cheias

        return (
            <>
                {Array(cheias)
                    .fill()
                    .map((_, index) => (
                        <PiSirenDuotone key={`cheias-${index}`} color='red' />
                    ))}
                {Array(vazias)
                    .fill()
                    .map((_, index) => (
                        <PiSirenDuotone key={`vazia-${index}`} color='gray' />
                    ))}
            </>
        )
    }

    const fotoPerfil = perfilData?.foto_perfil ? `http://18.228.8.220:8000${perfilData.foto_perfil}` : 'https://via.placeholder.com/150'
    const nomePerfil = perfilData?.first_name || 'Anônimo'
    
    return (
        <div className='flex flex-col min-w-48 min-h-48'>
            <div className='flex justify-between bg-white rounded-t-lg p-3'>
                <div className='flex gap-2'>
                    <img 
                        className='h-10 w-10 rounded-full object-cover' 
                        src={fotoPerfil} 
                        alt={`Perfil de ${nomePerfil}`} 
                    />
                    <div>
                        <h1 className='font-semibold text-xl -mb-1'>{nomePerfil}</h1>
                        <h1 className='font-[400] text-sm text-gray-400'>
                            Criado em: {data} às {hora}
                        </h1>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <div className='flex'>{renderStars(estrelas)}</div>
                    <h1 className='font-[400] text-sm text-gray-400'>{votos} votos</h1>
                </div>
            </div>
            <div className={`w-full h-full`}>
                <img 
                    alt={`Imagem de ${nome}`} 
                    src={`http://18.228.8.220:8000${imagem}` || 'https://via.placeholder.com/150'} 
                    className='w-full h-full object-cover' 
                />
            </div>
            <div className='flex justify-between items-center rounded-b-lg bg-white p-1'>
                <div className='px-3 flex flex-col font-semibold '>
                    <h1 className='text-sm mt-1 truncate'>{nome}</h1>
                    <div className='flex items-center mb-1'>
                        <h1>{emoji}</h1>
                        <h1 className='ml-1'>{texto}</h1>
                    </div>
                </div>
                <button
                    onClick={() => {
                        navigate(`/post/${id}`, {
                            state: { id, nome, status, imagem, fotoPerfil, nomePerfil, data, hora, votos, descricao, natureza }
                        })
                    }}
                    className='botao-estilo-3 px-3 h-8 mr-2'
                >
                    Detalhes
                </button>
            </div>
        </div>
    )
    
}

export default Post