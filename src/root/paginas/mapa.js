import React, { useEffect, useState } from 'react'
import { isBrowser } from 'react-device-detect'
import NavBar from '../componentes/nav_bar'
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

function Homepage() {
    const [posicaoAtual, setPosicaoAtual] = useState(null)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPosicaoAtual({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })

                },
                (err) => {
                    console.error(err)
                }
            )
        }
    }, [])

    if (isBrowser) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen">
                Acesso indisponível, tente novamente em um celular
            </div>
        )
    }

    // coordenadas direto para aracati, caso n dê certo pegar pela api do browser
    const coordenadasFallback = [-4.56447, -37.76533]
    const center = posicaoAtual ? [posicaoAtual.lat, posicaoAtual.lng] : coordenadasFallback

    return (
        <div className="relative h-full w-screen bg-[#e9e8e8]">
            <div className="bottom-0 start-0 fixed">
                <NavBar />
            </div>
            <div className="flex flex-col h-screen p-3">
                <h1 className="font-semibold text-xl mb-3">Localizar</h1>
                <input
                    type="text"
                    className="input-generico w-full"
                    placeholder="Entre com nomes de ruas ou bairros"
                ></input>

                <div className="w-screen -ml-3 h-[55%] ">
                    <MapContainer center={center} zoom={13}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer>
                </div>

                <div className="flex gap-2 mt-2 mb-4">
                    <button className="botao-estilo-1">Filtrar</button>
                    <button className="botao-estilo-2">Detalhes</button>
                </div>

                <h1 className="font-semibold text-xl mb-1">Filtrar por</h1>
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