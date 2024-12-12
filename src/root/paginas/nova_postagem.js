import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { RiArrowLeftSLine } from 'react-icons/ri'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

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

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData((prev) => ({ ...prev, imagem: file }))
        }
    }

    const centerMapOnLocation = () => {
        const map = mapRef.current
        if (map && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    const latlng = { lat: latitude, lng: longitude }
                    map.setView(latlng, 13)
                    setFormData((prev) => ({ ...prev, geolocalizacao: latlng }))
                    setPinPosition(latlng)
                },
                () => {
                    alert('Não foi possível obter sua localização atual.')
                }
            )
        } else {
            alert('Geolocalização não suportada no seu navegador ou mapa não disponível.')
        }
    }

    const natureza = [
        { id: '1', text: 'Infraestrutura', cor1: 'rgb(48,158,238)', cor2: 'rgb(75,136,181)' },
        { id: '2', text: 'Iluminação', cor1: 'rgb(243,221,51)', cor2: 'rgb(175,160,51)' },
        { id: '3', text: 'Coleta de Lixo', cor1: 'rgb(48,163,56)', cor2: 'rgb(48,86,50)' },
        { id: '4', text: 'Saneamento', cor1: 'rgb(173,100,48)', cor2: 'rgb(105,71,48)' },
        { id: '5', text: 'Transito', cor1: 'rgb(191,191,191)', cor2: 'rgb(122,122,122)' },
        { id: '6', text: 'Outro', cor1: 'rgb(242,242,242)', cor2: 'rgb(205,205,205)' },
    ]

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setPinPosition(e.latlng)
                setFormData((prev) => ({ ...prev, geolocalizacao: e.latlng }))
            },
        })

        return pinPosition ? <Marker position={pinPosition}></Marker> : null
    }

    const handleSubmit = async () => {
        const formDataToSend = new FormData()
        formDataToSend.append('titulo', formData.titulo)
        formDataToSend.append('descricao', formData.descricao)
        formDataToSend.append('natureza', formData.natureza)
        if (formData.imagem) {
            formDataToSend.append('imagem', formData.imagem)
        }
        if (formData.geolocalizacao) {
            formDataToSend.append('geolocalizacao', JSON.stringify(formData.geolocalizacao))
        }
    
        try {
            const response = await fetch('https://api.nero.lat/api/postagem/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formDataToSend,
            })
    
            if (response.ok) {
                alert('Postagem criada com sucesso!')
                navigate('/home')
            } else {
                setError(true)
                alert('Erro ao criar postagem.')
            }
        } catch (error) {
            setError(true)
            alert('Erro ao criar postagem.')
        }
    }

    return (
        <div className="flex flex-col h-screen bg-[#e9e8e8]">
            <div className='fixed top-0 flex items-center bg-white w-screen min-h-12 text-xl font-semibold shadow-inner gap-2'>
                <RiArrowLeftSLine className='ml-2' onClick={() => navigate(-1)} size={30} />
                <h1 className='shadow-2xl -mt-[2px]'>Criar Postagem</h1>
            </div>

            <div className='mx-3'>
                <div className="mt-14">
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
                    <h1 className="-mt-2 text-xs text-gray-400">Seja específico e forneça a maior quantidade de detalhes possíveis</h1>
                </div>

                <div>
                    <h1 className="font-semibold">Categoria</h1>
                    <div className="flex flex-wrap gap-2">
                        {natureza.map((item) => (
                            <button
                                key={item.id}
                                className="botao-estilo-5 text-white rounded-md"
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
                    <div className="flex gap-2 mb-2">
                        <button
                            className="botao-estilo-1"
                            onClick={centerMapOnLocation}
                        >
                            Usar localização atual
                        </button>
                        <label className="botao-estilo-2 text-center cursor-pointer">
                            Adicionar Imagem
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
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
                            style={{ height: "200px", width: "100%" }}
                            whenCreated={(mapInstance) => {
                                mapRef.current = mapInstance
                            }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                            />
                            <LocationMarker />
                        </MapContainer>
                    )}
                    <h1 className="-mt-2 text-xs text-gray-400">Clique no mapa para selecionar a localização</h1>
                </div>

                {error && (
                    <p className="text-red-500 text-sm mt-2">
                        Preencha os campos obrigatórios corretamente.
                    </p>
                )}

                <div className="flex flex-col justify-around gap-2 mt-4 w-full">
                    <button className="botao-estilo-2" onClick={handleSubmit}>
                        Postar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NovoPost