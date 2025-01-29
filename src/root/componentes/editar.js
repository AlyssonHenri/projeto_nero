import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Modal, Box, TextField } from '@mui/material'
import { isBrowser } from 'react-device-detect'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'

const iconePersonalizado = () => {
    const svgIcon = `
        <svg fill="rgb(48,158,238)" width="30" height="30" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M127.99414,15.9971a88.1046,88.1046,0,0,0-88,88c0,75.29688,80,132.17188,83.40625,134.55469a8.023,8.023,0,0,0,9.1875,0c3.40625-2.38281,83.40625-59.25781,83.40625-134.55469A88.10459,88.10459,0,0,0,127.99414,15.9971ZM128,72a32,32,0,1,1-32,32A31.99909,31.99909,0,0,1,128,72Z"/>
        </svg>
    `
    return new L.Icon({
        iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`,
        iconSize: [30, 30],
    })
}

function Editar({ id, setShowEditarModal, showEditarModal, titulo, descricao, natureza, funcUpdate }) {
    const navigate = useNavigate()
    const [erroLocalizacao, setErroLocalizacao] = useState(null)
    const [pinPosition, setPinPosition] = useState(null)
    const [dadosImagem, setDadosImagem] = useState(null)
    const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(true)
    const mapRef = useRef(null)
    const [formData, setFormData] = useState({
        titulo: titulo || '',
        descricao: descricao || '',
        natureza: natureza || '',
        imagem: null,
    })
    const token = localStorage.getItem('token')

    const handleImageChange = async (e) => {
        const file = e.target.files && e.target.files[0]
        if (file) {
            setDadosImagem(file)
            setFormData((prev) => ({ ...prev, imagem: file }))
        }
    }

    const handleEditarPostagem = async () => {
        try {
            const formDataEditar = new FormData()
            formDataEditar.append('titulo', formData.titulo)
            formDataEditar.append('descricao', formData.descricao)
            formDataEditar.append('natureza', formData.natureza)
            if (formData.imagem) {
                formDataEditar.append('imagem', dadosImagem)
            }

            const response = await fetch(`https://api.nero.lat/api/postagem/${id}/`, {
                method: 'PATCH',
                headers: {
                    accept: 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: formDataEditar,
            })

            if (response.ok) {
                setShowEditarModal(false)
                navigate('/home')
                funcUpdate()
            } else {
                console.error('Erro ao editar postagem:', await response.text())
            }
        } catch (error) {
            console.error('Erro ao editar postagem:', error)
        }
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

    useEffect(() => {
        centralizarMapa();
    }, [])

    const natureza_edit = [
        { id: '1', text: 'Infraestrutura', cor1: 'rgb(48,158,238)', cor2: 'rgb(75,136,181)' },
        { id: '2', text: 'Iluminação', cor1: 'rgb(243,221,51)', cor2: 'rgb(175,160,51)' },
        { id: '3', text: 'Coleta de Lixo', cor1: 'rgb(48,163,56)', cor2: 'rgb(48,86,50)' },
        { id: '4', text: 'Saneamento', cor1: 'rgb(173,100,48)', cor2: 'rgb(105,71,48)' },
        { id: '5', text: 'Transito', cor1: 'rgb(191,191,191)', cor2: 'rgb(122,122,122)' },
        { id: '6', text: 'Outro', cor1: 'rgb(242,242,242)', cor2: 'rgb(205,205,205)' },
    ]

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    }

    const centralizarMapa = () => {
        setCarregandoLocalizacao(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                const latlng = { lat: latitude, lng: longitude }
                setFormData((prev) => ({ ...prev, geolocalizacao: latlng }))
                setPinPosition(latlng)
                setCarregandoLocalizacao(false)
            },
            (error) => {
                console.error('Erro ao obter localização:', error)
                setErroLocalizacao('Não foi possível obter a localização.')
                setCarregandoLocalizacao(false)
            }
        )
    }

    return (
        <Modal open={showEditarModal} onClose={() => setShowEditarModal(false)}>
            <Box
                sx={{
                    ...modalStyle,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isBrowser ? '45%' : '95%'
                }}
            >
                <TextField
                    fullWidth
                    label="Título"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Descrição"
                    multiline
                    rows={4}
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    margin="normal"
                />
                <div className='flex flex-col w-full items-start'>
                    <h1 className="font-semibold">Categoria</h1>
                    <div className="flex flex-wrap gap-2">
                        {natureza_edit.map((item) => (
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

                <div className="flex flex-col w-full items-start mt-4">
                    <h1 className="font-semibold">Localização</h1>
                    <div className={`flex gap-2 mb-2 ${isBrowser ? 'w-[400px]' : ''}`}>
                        <button
                            className="botao-estilo-1 text-xs"
                            onClick={centralizarMapa}
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
                            style={{ height: isBrowser ? "38vh" : "200px", width: isBrowser ? "41vw" : "100%" }}
                            whenCreated={(mapInstance) => {
                                mapRef.current = mapInstance;
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

                <div style={{ alignSelf: 'center', marginTop: '16px' }}>
                    <button className="botao-estilo-1 px-4" onClick={handleEditarPostagem}>
                        Salvar
                    </button>
                </div>
            </Box>
        </Modal>
    )
}

export default Editar