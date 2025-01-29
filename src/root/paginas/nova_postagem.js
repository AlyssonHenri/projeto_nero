import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import NavBar from '../componentes/nav_bar'
import 'leaflet/dist/leaflet.css'
import { RiArrowLeftSLine } from 'react-icons/ri'
import { isBrowser, isMobile } from 'react-device-detect'

const iconePersonalizado = () => {
    const svgIcon = `
        <svg fill="rgb(48,158,238)" width="30" height="30" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M127.99414,15.9971a88.1046,88.1046,0,0,0-88,88c0,75.29688,80,132.17188,83.40625,134.55469a8.023,8.023,0,0,0,9.1875,0c3.40625-2.38281,83.40625-59.25781,83.40625-134.55469A88.10459,88.10459,0,0,0,127.99414,15.9971ZM128,72a32,32,0,1,1-32,32A31.99909,31.99909,0,0,1,128,72Z"/>
        </svg>
    `
    return new L.Icon({
        iconUrl: `data:image/svg+xmlbase64,${btoa(svgIcon)}`,
        iconSize: [30, 30],
    })
}

function NovoPost() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const mapRef = useRef(null)
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        imagem: '',
        geolocalizacao: null,
        natureza: ''
    })
    const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(true)
    const [erroLocalizacao, setErroLocalizacao] = useState(null)
    const [pinPosition, setPinPosition] = useState(null)
    const [imagemModalVisivel, setImagemModalVisivel] = useState(false)
    const [dadosImagem, setDadosImagem] = useState(null)

    const natureza = [
        { id: '1', text: 'Infraestrutura', cor1: 'rgb(48,158,238)', cor2: 'rgb(75,136,181)' },
        { id: '2', text: 'Iluminação', cor1: 'rgb(243,221,51)', cor2: 'rgb(175,160,51)' },
        { id: '3', text: 'Coleta de Lixo', cor1: 'rgb(48,163,56)', cor2: 'rgb(48,86,50)' },
        { id: '4', text: 'Saneamento', cor1: 'rgb(173,100,48)', cor2: 'rgb(105,71,48)' },
        { id: '5', text: 'Transito', cor1: 'rgb(191,191,191)', cor2: 'rgb(122,122,122)' },
        { id: '6', text: 'Outro', cor1: 'rgb(242,242,242)', cor2: 'rgb(205,205,205)' },
    ]

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    const latlng = { lat: latitude, lng: longitude }
                    setFormData((prev) => ({ ...prev, geolocalizacao: latlng }))
                    setCarregandoLocalizacao(false)
                },
                (err) => {
                    setErroLocalizacao("Não foi possível acessar sua localização.")
                    console.error("Erro ao obter localização:", err)
                    setCarregandoLocalizacao(false)
                }
            )
        } else {
            setErroLocalizacao("Geolocalização não é suportada pelo seu navegador.")
            setCarregandoLocalizacao(false)
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleImageChange = async (e) => {
        const file = e.target.files && e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setDadosImagem({
              previsaoImagem: reader.result,
              arquivoImagem: file,
            })
          }
          reader.readAsDataURL(file)
        }
    }

    const centralizarMapa = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                const latlng = { lat: latitude, lng: longitude }
                setFormData((prev) => ({ ...prev, geolocalizacao: latlng }))
                setPinPosition(latlng)
            },
        )
    }

    const PinPos = () => {
        useMapEvents({
            click(e) {
                setPinPosition(e.latlng)
                setFormData((prev) => ({ ...prev, geolocalizacao: e.latlng }))
            },
        })

        return pinPosition ? <Marker position={pinPosition} icon={iconePersonalizado()}></Marker> : null
    }

    const handleSubmit = async (isAnonymous = false) => {
        if (!formData.titulo || !formData.descricao || !formData.natureza) {
            alert("Por favor, preencha todos os campos obrigatórios.")
            return
        }
    
        const formDataToSend = new FormData()
        formDataToSend.append('titulo', formData.titulo)
        formDataToSend.append('descricao', formData.descricao)
        formDataToSend.append('natureza', formData.natureza)
    
        if (dadosImagem?.arquivoImagem) {
            formDataToSend.append("imagem", dadosImagem.arquivoImagem)
        }
        
        if (formData.geolocalizacao) {
            const { lat, lng } = formData.geolocalizacao
            formDataToSend.append('geolocalizacao', `${lat},${lng}`)
        }
    
        try {    
            const response = await fetch('https://api.nero.lat/api/postagem/', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: formDataToSend,
            })
    
            if (response.ok) {
                alert('Postagem criada com sucesso!')
                navigate('/home')
            } else {
                const errorData = await response.json()
                console.error("Erro da API:", errorData)
                alert('Erro ao criar postagem.')
            }
        } catch (error) {
            console.error("Erro na requisição:", error)
            alert('Erro ao criar postagem.')
        }
    }
    
    return (
        <div className="flex flex-col h-screen bg-[#e9e8e8]">
            {isMobile && 
                <div className="fixed top-0 flex items-center bg-white w-screen min-h-12 text-xl font-semibold shadow-inner gap-2">
                    <RiArrowLeftSLine className="ml-2" onClick={() => navigate(-1)} size={30} />
                    <h1 className="font-semibold text-xl -mt-[1px]">Criar Postagem</h1>
                </div>
            }
            <NavBar />

            <div className={`mx-3 ${isBrowser ? 'px-[5%]' : 'mt-10'}`}>
                {isBrowser && <h1 className="text-2xl font-semibold mt-5">Criar Postagem</h1>}
                <div className="mt-5">
                    <h1 className="font-semibold">Titulo</h1>
                    <input
                        type="text"
                        name="titulo"
                        className="input-generico w-full"
                        placeholder="Insira o titulo do problema"
                        value={formData.titulo}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <h1 className="font-semibold">Descrição</h1>
                    <input
                        type="text"
                        name="descricao"
                        className="input-generico w-full"
                        placeholder="Insira uma descrição concisa do problema"
                        value={formData.descricao}
                        onChange={handleChange}
                    />
                    <h1 className="-mt-2 text-xs text-gray-400">Seja específico(a) e forneça a maior quantidade de detalhes possíveis</h1>
                </div>

                <div>
                    <h1 className="font-semibold">Categoria</h1>
                    <div className="flex flex-wrap gap-2">
                        {natureza.map((item) => (
                            <button
                                key={item.id}
                                className={`botao-estilo-5 text-white rounded-md ${formData.natureza === item.id ? 'border border-black' : ''}`}
                                style={{ background: `linear-gradient(to bottom, ${item.cor1}, ${item.cor2}` }}
                                onClick={() => setFormData((prev) => ({ ...prev, natureza: item.id }))}
                            >
                                {item.text}
                            </button>
                        ))}
                    </div>
                    <h1 className="-mb-2 text-xs text-gray-400">Escolha a categoria que melhor se adequa à sua reclamação</h1>
                </div>

                <div className="mt-4">
                    <h1 className="font-semibold">Localização</h1>
                    <div className={`flex gap-2 mb-2 ${isBrowser ? 'w-[400px]' : ''}`}>
                        <button
                            className="botao-estilo-1"
                            onClick={centralizarMapa}
                        >
                            Usar localização atual
                        </button>
                        <label className="botao-estilo-2 text-center cursor-pointer">
                            Adicionar Imagem
                            {dadosImagem ? 
                                <button
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onClick={() => setImagemModalVisivel(true)}
                                /> 
                            :
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            }
                        </label>
                    </div>
                    {carregandoLocalizacao ? (
                        <p className="text-lg font-medium">Carregando localização...</p>
                    ) : erroLocalizacao ? (
                        <p className="text-lg text-red-600">{erroLocalizacao}</p>
                    ) : (
                        <MapContainer
                            center={formData.geolocalizacao || [-23.55052, -46.633308]}
                            zoom={13}
                            style={{ height: isBrowser ? "30vh" : "200px", width: "100%" }}
                            whenCreated={(mapInstance) => {
                                mapRef.current = mapInstance
                            }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                            />
                            <PinPos />
                        </MapContainer>
                    )}
                    <h1 className="text-xs text-gray-400">Clique no mapa para selecionar a localização</h1>
                </div>

                {error && (
                    <p className="text-red-500 text-sm mt-2">
                        Preencha os campos obrigatórios corretamente.
                    </p>
                )}
                

                <div className={`${isBrowser? 'flex gap-2 w-full items-center justify-center' : 'flex-col'}`}>
                    <div className={`flex flex-col gap-2 mt-4 ${isBrowser ? 'w-72' : 'w-full'}`}>
                        <button className={`botao-estilo-2 ${isBrowser ? 'mb-20' : ''}`} onClick={handleSubmit}>
                            Postar
                        </button>
                    </div>
                    {false &&
                        <div className={`flex flex-col gap-2 mt-4 ${isBrowser ? 'w-72' : 'w-full'}`}>
                            <button className="botao-estilo-4 mb-20" onClick={handleSubmit}>
                                😶 Anônimo
                            </button>
                        </div>
                    }
                </div>
            </div>

            {imagemModalVisivel && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg mx-5">
                        <img src={dadosImagem.previsaoImagem} alt="Pré-visualização" className="max-w-full max-h-[80vh]" />
                        <div className='w-full flex flex-col'>
                            <label className="botao-estilo-1 mt-3 text-center cursor-pointer">
                                Nova Imagem
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                            <button
                                className="mt-2 botao-estilo-1"
                                onClick={() => setImagemModalVisivel(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NovoPost