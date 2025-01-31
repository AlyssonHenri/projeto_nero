import React, { useEffect, useState } from 'react'
import { isBrowser } from 'react-device-detect'

function Comentario({ texto, usuario }) {
    const token = localStorage.getItem('token')
    const [perfilData, setPerfilData] = useState(null)

    const fetchPerfilData = async () => {
        try {
            const response = await fetch(`https://api.nero.lat/api/usuario/${usuario}/`, {
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

    const fotoPerfil = perfilData?.foto_perfil ? `https://api.nero.lat/${perfilData.foto_perfil}` : '/images/sem-foto.png'
    const nomePerfil = perfilData?.first_name || 'Anônimo'
    
    return (
        <div>
            {isBrowser ? (
                <div className='flex flex-col bg-white h-36 min-w-60 rounded-lg p-4 border-2 border-[#dbdbdb]'>
                    <div className='flex items-center gap-2'>
                        <img 
                            className='h-8 w-8 rounded-full object-cover' 
                            src={fotoPerfil} 
                            alt={`Perfil de ${nomePerfil}`} 
                        />
                        <h1 className='font-semibold truncate'>{nomePerfil || 'Anônimo'}</h1>
                    </div>
                    <p 
                        className='text-gray-600 line-clamp-3 overflow-hidden mt-2' 
                        style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {texto}
                    </p>
                </div>
            ) : (        
                <div className='flex flex-col bg-white h-36 min-w-60 rounded-lg p-4 shadow-md'>
                    <div className='flex items-center gap-2'>
                        <img 
                            className='h-8 w-8 rounded-full object-cover' 
                            src={fotoPerfil} 
                            alt={`Perfil de ${nomePerfil}`} 
                        />
                        <h1 className='font-semibold truncate'>{nomePerfil || 'Anônimo'}</h1>
                    </div>
                    <p 
                        className='text-gray-600 line-clamp-3 overflow-hidden mt-2' 
                        style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {texto}
                    </p>
                </div>
            )}
        </div>
    );
}

export default Comentario;
