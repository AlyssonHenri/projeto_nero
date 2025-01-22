import React, { useEffect, useState } from "react";
import { isBrowser } from "react-device-detect";
import NavBar from "../componentes/nav_bar";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { RiArrowLeftSLine } from "react-icons/ri";
import dayjs from "dayjs"; // Adicionar biblioteca para manipulação de datas.

function Homepage() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [posicaoAtual, setPosicaoAtual] = useState(null);
    const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(true);
    const [erroLocalizacao, setErroLocalizacao] = useState(null);
    const [postagens, setPostagens] = useState([]);
    const [modalAberto, setModalAberto] = useState(null);
    const [filtros, setFiltros] = useState({
        tempo: null,
        categoria: null,
        avaliacoes: null,
    });

    const tipoCor = {
        1: "#3B82F6",
        2: "#F59E0B",
        3: "#10B981",
        4: "#9E7D44",
        5: "#6B7280",
        6: "#E5E7EB",
    };

    const tipoTexto = {
        1: "Infraestrutura",
        2: "Iluminação",
        3: "Coleta de lixo",
        4: "Saneamento",
        5: "Trânsito",
        6: "Outros",
    };

    const intervaloDatas = {
        Hoje: () => dayjs().startOf("day").toISOString(),
        "Esta Semana": () => dayjs().startOf("week").toISOString(),
        "Este Mês": () => dayjs().startOf("month").toISOString(),
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPosicaoAtual({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setCarregandoLocalizacao(false);
                },
                (err) => {
                    setErroLocalizacao("Não foi possível acessar sua localização.");
                    console.error("Erro ao obter localização:", err);
                    setCarregandoLocalizacao(false);
                }
            );
        } else {
            setErroLocalizacao("Geolocalização não é suportada pelo seu navegador.");
            setCarregandoLocalizacao(false);
        }

        const fetchPosts = async () => {
            try {
                const response = await fetch("https://api.nero.lat/api/feed/", {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const postagensFormatadas = data
                        .map((post) => {
                            if (!post.geolocalizacao) return null;
                            const [lat, lng] = post.geolocalizacao.split(",");
                            const coordenadasValidas = !isNaN(lat) && !isNaN(lng);

                            if (coordenadasValidas) {
                                return {
                                    ...post,
                                    lat: parseFloat(lat),
                                    lng: parseFloat(lng),
                                    cor: tipoCor[post.natureza] || "#E5E7EB",
                                    tipo: tipoTexto[post.natureza] || "Outro",
                                };
                            }

                            return null;
                        })
                        .filter((post) => post !== null);

                    setPostagens(postagensFormatadas);
                } else {
                    console.error(`Erro ao carregar postagens: ${response.status}`);
                }
            } catch (error) {
                console.error("Erro de conexão ao carregar postagens:", error);
            }
        };

        fetchPosts();
    }, []);

    const coordenadasFallback = [-4.56447, -37.76533];
    const centro = posicaoAtual
        ? [posicaoAtual.lat, posicaoAtual.lng]
        : coordenadasFallback;

    const iconePersonalizado = (cor) => {
        const svgIcon = `
            <svg fill="${cor}" width="30" height="30" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <path d="M127.99414,15.9971a88.1046,88.1046,0,0,0-88,88c0,75.29688,80,132.17188,83.40625,134.55469a8.023,8.023,0,0,0,9.1875,0c3.40625-2.38281,83.40625-59.25781,83.40625-134.55469A88.10459,88.10459,0,0,0,127.99414,15.9971ZM128,72a32,32,0,1,1-32,32A31.99909,31.99909,0,0,1,128,72Z"/>
            </svg>
        `;
        return new L.Icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
            iconSize: [30, 30],
        });
    };

    const abrirModal = (tipo) => setModalAberto(tipo);
    const fecharModal = () => setModalAberto(null);

    const aplicarOuRemoverFiltro = (tipo, valor) => {
        setFiltros((prev) => ({
            ...prev,
            [tipo]: prev[tipo] === valor ? null : valor,
        }));
        fecharModal();
    };

    const renderModal = () => {
        if (!modalAberto) return null;

        let opcoes = [];
        if (modalAberto === "Tempo") {
            opcoes = ["Hoje", "Esta Semana", "Este Mês"];
        } else if (modalAberto === "Categoria") {
            opcoes = Object.values(tipoTexto);
        }

        return (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[99]">
                <div className="bg-white p-4 rounded shadow-lg w-[90%]">
                    <h2 className="font-semibold text-xl mb-4">{modalAberto}</h2>
                    <div className="flex flex-col gap-2">
                        {opcoes.map((opcao, index) => (
                            <button
                                key={index}
                                className={`botao-estilo-4 ${
                                    filtros[modalAberto.toLowerCase()] === opcao ? "bg-[#022148c5] text-white" : ""
                                }`}
                                onClick={() => aplicarOuRemoverFiltro(modalAberto.toLowerCase(), opcao)}
                            >
                                {opcao}
                            </button>
                        ))}
                    </div>
                    <button className="botao-estilo-2 mt-4" onClick={fecharModal}>
                        Fechar
                    </button>
                </div>
            </div>
        );
    };

    const postagensFiltradas = postagens.filter((post) => {
        const filtroDataAtivo = filtros.tempo && intervaloDatas[filtros.tempo]();
        if (filtroDataAtivo && dayjs(post.criacao).isBefore(filtroDataAtivo)) return false;
        if (filtros.categoria && post.tipo !== filtros.categoria) return false;
        return true;
    });

    if (isBrowser) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen">
                <p className="text-lg font-medium">
                    Acesso indisponível, tente novamente em um dispositivo móvel.
                </p>
            </div>
        );
    }

    return (
        <div className="relative h-full w-screen bg-[#e9e8e8]">
            <div className="fixed top-0 flex items-center bg-white w-screen min-h-12 text-xl font-semibold shadow-inner gap-2">
                <RiArrowLeftSLine className="ml-2" onClick={() => navigate(-1)} size={30} />
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

                {carregandoLocalizacao ? (
                    <div className="flex justify-center items-center h-[55%]">
                        <p className="text-lg font-medium">Carregando mapa...</p>
                    </div>
                ) : erroLocalizacao ? (
                    <div className="flex justify-center items-center h-[55%]">
                        <p className="text-lg text-red-600">{erroLocalizacao}</p>
                    </div>
                ) : (
                    <div className="w-screen -ml-3 h-[55%]">
                        <MapContainer center={centro} zoom={13}>
                            <TileLayer
                                attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {postagensFiltradas.map((loc, index) => (
                                <Marker
                                    key={index}
                                    position={[loc.lat, loc.lng]}
                                    icon={iconePersonalizado(loc.cor)}
                                >
                                    <Tooltip direction="bottom" offset={[0, 0]}>
                                        <div style={{ textAlign: "center" }}>
                                            {loc.titulo}
                                            <br />
                                            {loc.imagem && (
                                                <img
                                                    src={`https://api.nero.lat/${loc.imagem}`}
                                                    alt="Imagem"
                                                    style={{ width: "100%", height: "100%" }}
                                                />
                                            )}
                                        </div>
                                    </Tooltip>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                )}

                <h1 className="font-semibold text-xl mb-1 mt-4">Filtrar por</h1>
                <div className="flex w-full gap-2 overflow-x-auto pb-3">
                    <button
                        className={`botao-estilo-4 w-full ${
                            filtros.tempo ? "bg-[#022148c5] text-white" : ""
                        }`}
                        onClick={() => abrirModal("Tempo")}
                    >
                        ⏱️ Tempo
                    </button>
                    <button
                        className={`botao-estilo-4 w-full  ${
                            filtros.categoria ? "bg-[#022148c5] text-white" : ""
                        }`}
                        onClick={() => abrirModal("Categoria")}
                    >
                        📋 Categoria
                    </button>
                </div>

                <button className="botao-estilo-2 mt-2">Criar Postagem</button>
            </div>

            {renderModal()}
        </div>
    );
}

export default Homepage;
