import React from 'react'
import { isBrowser } from 'react-device-detect'
import { FcHome, FcPanorama } from 'react-icons/fc'
import { IoPersonCircle } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

function NavBar({imgPerfil}) {
    const navigate = useNavigate()

    return (
        <div>
            {isBrowser ? (
                <div className='flex items-center justify-between px-5 bg-white w-screen h-16 shadow-lg'>
                    <h1 className='text-xl font-semibold'>Nero</h1>
                    <div className='flex gap-3 items-center justify-center cursor-pointer'>
                        <h1 onClick={() => navigate('/home')}>Inicio</h1>
                        <h1 onClick={() => navigate('/mapa')}>Mapa Interativo</h1>
                        <h1 onClick={() => navigate('/perfil')}>Perfil</h1>
                        <img onClick={() => navigate('/perfil')} src={imgPerfil || '/images/sem-imagem.png'} className='h-14 w-14 object-cover' alt='foto_perfil'/>
                    </div>
                </div>
            ) : (        
                <div className='bottom-0 start-0 fixed z-50'>
                    <div className='flex items-center px-5 justify-around bg-white w-screen min-h-16 text-sm font-semibold shadow-inner'>
                        <div onClick={() => {navigate('/home')}} className='flex flex-col items-center justify-center'>
                            <FcHome size={30}/>
                            <h1>Início</h1>
                        </div>
                        <div onClick={() => {navigate('/mapa')}} className='flex flex-col items-center justify-center'>
                            <FcPanorama size={30}/>
                            <h1>Mapa Interativo</h1>
                        </div>
                        <div onClick={() => {navigate('/perfil')}} className='flex flex-col items-center justify-center'>
                            <IoPersonCircle size={30}/>
                            <h1>Perfil</h1>
                        </div>
                    </div> 
                </div>
            )}
        </div>
    )
}

export default NavBar