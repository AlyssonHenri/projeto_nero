import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function Homepage() {
    const [posicaoAtual, setPosicaoAtual] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [dadosCidades, setDadosCidades] = useState([]);

    useEffect(() => {
        // Obtém a localização atual
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPosicaoAtual({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setCarregando(false);
                },
                () => {
                    console.error("Não foi possível acessar a localização.");
                    setCarregando(false);
                }
            );
        }

        // Faz a requisição para obter as cidades
        const fetchCidades = async () => {
            try {
                const response = await fetch("https://api.nero.lat/api/informacoes/cidades/", {
                    headers: { Accept: "application/json" },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDadosCidades(data);
                } else {
                    console.error("Erro ao carregar dados das cidades.");
                }
            } catch (error) {
                console.error("Erro ao conectar-se à API:", error);
            }
        };

        fetchCidades();
    }, []);

    const centroPadrao = [-4.56447, -37.76533];

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            {carregando ? (
                <p>Carregando mapa...</p>
            ) : (
                <MapContainer center={posicaoAtual || centroPadrao} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Adicionar os polígonos das cidades */}
                    {dadosCidades.map((cidade) => (
                        <React.Fragment key={cidade.id}>
                            <Polygon
                                positions={cidade.pontos}
                                color="blue"
                                fillOpacity={0.4}
                                pathOptions={{ color: "#0000FF", weight: 2 }}
                            >
                                <Tooltip>{cidade.nome}</Tooltip>
                            </Polygon>

                            {/* Adicionar os polígonos dos bairros */}
                            {cidade.bairros.map((bairro) => (
                                <Polygon
                                    key={bairro.id}
                                    positions={bairro.pontos}
                                    color="green"
                                    fillOpacity={0.3}
                                    pathOptions={{ color: "#00FF00", weight: 2 }}
                                >
                                    <Tooltip>{bairro.nome}</Tooltip>
                                </Polygon>
                            ))}
                        </React.Fragment>
                    ))}
                </MapContainer>
            )}
        </div>
    );
}

export default Homepage;
