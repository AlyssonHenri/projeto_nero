import React from 'react'

function Miniatura({ tipo, nome, status, imagem }) {
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

    const corDeFundo = tipoCor[tipo] || 'bg-gray-500'
    const textoTipo = tipoTexto[tipo] || 'Desconhecido'

    const statusInfo = {
        pendente: { emoji: '🔴', texto: 'Pendente' },
        resolvido: { emoji: '🟢', texto: 'Resolvido' }
    }

    const { emoji, texto } = statusInfo[status.toLowerCase()] || statusInfo.pendente

    return (
        <div className='flex flex-col w-[48%] min-h-48'>
            <div className={`relative w-full h-full`}>
                <img
                    alt={`Imagem de ${nome}`}
                    src={`http://18.228.8.220:8000${imagem}`}
                    className='w-full h-full rounded-t-lg rounded-ss-xl'
                />
                <h1 className={`absolute ${corDeFundo} p-1 rounded-ss-lg rounded-ee-lg text-white top-0 text-sm`}>
                    {textoTipo}
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
