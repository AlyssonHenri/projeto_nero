import React from 'react'

function Miniatura({ tipo, nome, status, imagem }) {
    const tipoCor = {
        infraestrutura: 'bg-blue-500',
        iluminacao: 'bg-yellow-500',
        agua: 'bg-teal-500',
        saneamento: 'bg-green-500',
        outros: 'bg-gray-500'
    }

    const corDeFundo = tipoCor[tipo.toLowerCase()] || 'bg-gray-500'

    const statusInfo = {
        pendente: { emoji: '🔴', texto: 'Pendente' },
        resolvido: { emoji: '🟢', texto: 'Resolvido' }
    }

    const { emoji, texto } = statusInfo[status.toLowerCase()] || statusInfo.pendente

    return (
        <div className='flex flex-col min-w-[48%] min-h-48'>
            <div className={`relative w-full h-full`}>
                <img
                    alt={`Imagem de ${nome}`}
                    src={imagem}
                    className='w-full h-full rounded-t-lg rounded-ss-xl'
                />
                <h1 className={`absolute ${corDeFundo} p-1 rounded-ss-lg rounded-ee-lg text-white top-0 text-sm`}>
                    {tipo}
                </h1>
            </div>
            <div className='bg-white px-3 flex flex-col font-semibold rounded-b-lg'>
                <h1 className='text-sm mt-1 truncate'>{nome}</h1>
                <div className='flex items-center mb-1'>
                    <h1>{emoji}</h1>
                    <h1 className='ml-1'>{texto}</h1>
                </div>
            </div>
        </div>
    )
}

export default Miniatura