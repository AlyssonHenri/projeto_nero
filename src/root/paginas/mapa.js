import React, { useEffect, useState } from "react"
import { isBrowser } from "react-device-detect"
import NavBar from "../componentes/nav_bar"
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet"
import { PiArrowLeftBold } from "react-icons/pi"
import { useNavigate } from "react-router-dom"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

function Homepage() {
    const navigate = useNavigate()
    const [posicaoAtual, setPosicaoAtual] = useState(null)
    const [loadingLocation, setLoadingLocation] = useState(true)
    const [locationError, setLocationError] = useState(null)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPosicaoAtual({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                    setLoadingLocation(false)
                },
                (err) => {
                    setLocationError("Não foi possível acessar sua localização.")
                    console.error("Erro ao obter localização:", err)
                    setLoadingLocation(false)
                }
            )
        } else {
            setLocationError("Geolocalização não é suportada pelo seu navegador.")
            setLoadingLocation(false)
        }

        fetch("../jsons/pins.json")
            .then((response) => response.json())
            .then((data) => setPosts(data))
            .catch((error) => console.error("Erro ao carregar locais:", error))
    }, [])

    if (isBrowser) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen">
                <p className="text-lg font-medium">
                    Acesso indisponível, tente novamente em um dispositivo móvel.
                </p>
            </div>
        )
    }

    const coordenadasFallback = [-4.56447, -37.76533]
    const center = posicaoAtual
        ? [posicaoAtual.lat, posicaoAtual.lng]
        : coordenadasFallback

    const customIcon = (color) => {
        const svgIcon = `
            <svg fill="${color}" width="30" height="30" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <path d="M127.99414,15.9971a88.1046,88.1046,0,0,0-88,88c0,75.29688,80,132.17188,83.40625,134.55469a8.023,8.023,0,0,0,9.1875,0c3.40625-2.38281,83.40625-59.25781,83.40625-134.55469A88.10459,88.10459,0,0,0,127.99414,15.9971ZM128,72a32,32,0,1,1-32,32A31.99909,31.99909,0,0,1,128,72Z"/>
            </svg>
        `
    
        return new L.Icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
            iconSize: [30, 30],
        })
    }
        
    return (
        <div className="relative h-full w-screen bg-[#e9e8e8]">
            <div className='fixed top-0 flex items-center bg-white w-screen min-h-12 text-xl font-semibold shadow-inner gap-2'>
                <PiArrowLeftBold className='ml-2' onClick={() => navigate('/home')} size={20} />
                <h1 className="font-semibold text-xl -mt-[1px]">Localizar</h1>
            </div>
            <div className="bottom-0 start-0 fixed">
                <NavBar />
            </div>
            <div className="flex flex-col h-screen p-3 mt-12">
                <input
                    type="text"
                    className="input-generico w-full"
                    placeholder="Entre com nomes de ruas ou bairros"
                />

                {loadingLocation ? (
                    <div className="flex justify-center items-center h-[55%]">
                        <p className="text-lg font-medium">Carregando mapa...</p>
                    </div>
                ) : locationError ? (
                    <div className="flex justify-center items-center h-[55%]">
                        <p className="text-lg text-red-600">{locationError}</p>
                    </div>
                ) : (
                    <div className="w-screen -ml-3 h-[55%]">
                        <MapContainer center={center} zoom={13}>
                            <TileLayer
                                attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {posts.map((loc, index) => (
                                <Marker
                                    key={index}
                                    position={[loc.lat, loc.lng]}
                                    icon={customIcon(loc.color)}
                                >
                                    <Tooltip
                                        direction="bottom"
                                        offset={[0, 0]}
                                        className="myCSSClass"
                                    >
                                        {loc.text}
                                    </Tooltip>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                )}

                <h1 className="font-semibold text-xl mb-1 mt-4">Filtrar por</h1>
                <div className="flex w-full gap-2 overflow-x-auto pb-3">
                    <button className="botao-estilo-4">⏱️ Tempo</button>
                    <button className="botao-estilo-4">📋 Categoria</button>
                    <button className="botao-estilo-4">⭐ Avaliações</button>
                </div>

                <button className="botao-estilo-2 mt-2">Criar Postagem</button>
            </div>
        </div>
    )
}

export default Homepage