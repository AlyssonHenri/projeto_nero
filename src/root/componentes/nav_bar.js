import React from 'react'
import { FcHome, FcPanorama } from 'react-icons/fc'
import { IoPersonCircle } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

function NavBar() {
    const navigate = useNavigate()

    return (
        <div className='flex items-center px-5 justify-around bg-white w-screen min-h-16 text-sm font-semibold shadow-inner'>
            <div onClick={() => {navigate('/home')}} className='flex flex-col items-center justify-center'>
                <FcHome size={30}/>
                <h1>Início</h1>
            </div>
            <div className='flex flex-col items-center justify-center'>
                <FcPanorama size={30}/>
                <h1>Mapa Interativo</h1>
            </div>
            <div className='flex flex-col items-center justify-center'>
                <IoPersonCircle size={30}/>
                <h1>Perfil</h1>
            </div>
        </div>
    )
}

export default NavBar