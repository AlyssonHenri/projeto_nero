import React, { useEffect, useState } from "react";
import { isBrowser } from "react-device-detect";
import NavBar from "../componentes/nav_bar";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { PiArrowLeft, PiArrowLeftBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function Homepage() {
    const navigate = useNavigate()
    const [posicaoAtual, setPosicaoAtual] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPosicaoAtual({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setLoadingLocation(false);
                },
                (err) => {
                    setLocationError("Não foi possível acessar sua localização.");
                    console.error("Erro ao obter localização:", err);
                    setLoadingLocation(false);
                }
            );
        } else {
            setLocationError("Geolocalização não é suportada pelo seu navegador.");
            setLoadingLocation(false);
        }
    }, []);

    if (isBrowser) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen">
                <p className="text-lg font-medium">
                    Acesso indisponível, tente novamente em um dispositivo móvel.
                </p>
            </div>
        );
    }

    // coordenadas de aracati
    const coordenadasFallback = [-4.56447, -37.76533];
    const center = posicaoAtual
        ? [posicaoAtual.lat, posicaoAtual.lng]
        : coordenadasFallback;

    return (
        <div className="relative h-full w-screen bg-[#e9e8e8]">
            <div className="bottom-0 start-0 fixed">
                <NavBar />
            </div>
            <div className="flex flex-col h-screen p-3">
                <div className="flex items-center gap-2 mb-3">
                    <PiArrowLeftBold onClick={() => (navigate('/home'))} size={20}/>
                    <h1 className="font-semibold text-xl -mt-[1px]">Localizar</h1>
                </div>
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
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
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
    );
}

export default Homepage;