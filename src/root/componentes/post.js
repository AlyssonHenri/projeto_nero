import React from 'react'
import { PiStarFill } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

function Post({ id, nome, status, imagem, fotoPerfil, perfil, data, hora, votos, estrelas, descricao, natureza }) {
    const navigate = useNavigate()
    const statusInfo = {
        pendente: { emoji: '🔴', texto: 'Pendente' },
        resolvido: { emoji: '🟢', texto: 'Resolvido' }
    }

    const { emoji, texto } = statusInfo[status.toLowerCase()] || statusInfo.pendente

    const renderStars = (rating) => {
        const max = 5
        const cheias = Math.min(rating, max)
        const vazias = max - cheias

        return (
            <>
                {Array(cheias)
                    .fill()
                    .map((_, index) => (
                        <PiStarFill key={`cheias-${index}`} color='red' />
                    ))}
                {Array(vazias)
                    .fill()
                    .map((_, index) => (
                        <PiStarFill key={`vazia-${index}`} />
                    ))}
            </>
        )
    }

    return (
        <div className='flex flex-col min-w-48 min-h-48'>
            <div className='flex justify-between bg-white rounded-t-lg p-3'>
                <div className='flex gap-2'>
                    <img className='h-10 w-10 rounded-full object-cover' src={fotoPerfil} alt={`Perfil de ${perfil}`} />
                    <div>
                        <h1 className='font-semibold text-xl -mb-1'>{perfil}</h1>
                        <h1 className='font-[400] text-sm text-gray-400'>
                            Criado em: {data} as {hora}
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
                    src={imagem}
                    className='w-full h-full'
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
                <button onClick={() => { navigate(`/post/${id}`, { state: { id, nome, status, imagem, fotoPerfil, perfil, data, hora, votos, estrelas, descricao, natureza } }) }} className='botao-estilo-3 px-3 h-8 mr-2'>Detalhes</button>
            </div>
        </div>
    )
}

export default Post