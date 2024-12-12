import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Corrige problemas com o ícone padrão do Leaflet
import 'leaflet/dist/leaflet.css'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

function NovoPost() {
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
        { id: '1', text: 'Infraestrutura', color: 'bg-blue-500' },
        { id: '2', text: 'Iluminação', color: 'bg-yellow-500' },
        { id: '3', text: 'Coleta de Lixo', color: 'bg-green-500' },
        { id: '4', text: 'Saneamento', color: 'bg-teal-500' },
        { id: '5', text: 'Transito', color: 'bg-red-500' },
        { id: '6', text: 'Outro', color: 'bg-gray-500' },
    ]

    const LocationMarker = () => {
        const [position, setPosition] = useState(null)
        const map = useMapEvents({
            click(e) {
                setPosition(e.latlng)
                setFormData((prev) => ({ ...prev, geolocalizacao: e.latlng }))
            },
            locationfound(e) {
                setPosition(e.latlng)
                setFormData((prev) => ({ ...prev, geolocalizacao: e.latlng }))
            },
        })

        return position ? <Marker position={position}></Marker> : null
    }

    return (
        <div className="flex flex-col h-screen w-[95%] ml-3">
            <div className="fixed top-0 flex items-center -ml-3 bg-white w-screen min-h-12 text-xl font-semibold shadow-xl gap-2">
                <h1 className="shadow-2xl -mt-[2px] ml-3">Criar Postagem </h1>
            </div>

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
                            className={`botao-estilo-5 ${item.color} text-white rounded-md`}
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
                        className="botao-estilo-2"
                        onClick={centerMapOnLocation}
                    >
                        Centralizar no Local Atual
                    </button>
                    <label className="botao-estilo-2 cursor-pointer">
                        Adicionar Imagem
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>
                <MapContainer
                    center={[-23.55052, -46.633308]}
                    zoom={13}
                    style={{ height: "200px", width: "100%" }}
                    whenCreated={(mapInstance) => {
                        mapRef.current = mapInstance
                    }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    <LocationMarker />
                </MapContainer>
                <h1 className="-mt-2 text-xs text-gray-400">Clique no mapa para selecionar a localização</h1>
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-2">
                    Preencha os campos obrigatórios corretamente.
                </p>
            )}

            <div className="flex flex-col justify-around gap-2 mt-4 w-full">
                <button className="botao-estilo-2">
                    Postar
                </button>
            </div>
        </div>
    )
}

export default NovoPost