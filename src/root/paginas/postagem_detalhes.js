import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavBar from '../componentes/nav_bar'
import Comentario from '../componentes/comentario'
import L from 'leaflet'
import { RiArrowLeftSLine } from 'react-icons/ri'
import { PiSirenDuotone } from 'react-icons/pi'
import { Modal, Box, TextField, CircularProgress, Button } from '@mui/material'
import { isBrowser } from 'react-device-detect'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'

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

function Detalhes() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const [comentarios, setComentarios] = useState([])
    const [showComentarioModal, setShowComentarioModal] = useState(false)
    const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false)
    const [showEditarModal, setShowEditarModal] = useState(false)
    const [novoComentario, setNovoComentario] = useState("")
    const [avaliacao, setAvaliacao] = useState(0)
    const [loadingF, setLoadingF] = useState(false)
    const [loadingR, setLoadingR] = useState(false)
    const [erroLocalizacao, setErroLocalizacao] = useState(null)
    const [pinPosition, setPinPosition] = useState(null)
    const [dadosImagem, setDadosImagem] = useState(null)
    const [imagemModalVisivel, setImagemModalVisivel] = useState(false)
    const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(true)
    const mapRef = useRef(null)
    const [formData, setFormData] = useState({
        titulo: state?.titulo || '',
        descricao: state?.descricao || '',
        natureza: state?.natureza || '',
        imagem: null,
    })
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('id')
    const tipo = localStorage.getItem('tipo')

    const fetchComentarios = async () => {
        try {
            const response = await fetch(`https://api.nero.lat/api/postagem/${state.id}/comentarios/`, {
                headers: {
                    accept: 'application/json',
                    Authorization: `Token ${token}`,
                },
            })
            const data = await response.json()
            setComentarios(data)
        } catch (error) {
            console.error('Erro ao buscar os comentários:', error)
        }
    }

    const enviarComentario = async () => {
        try {
            const formData = new FormData()
            formData.append('texto', novoComentario)
            formData.append('postagem', state.id)

            const response = await fetch(`https://api.nero.lat/api/postagem/comentario/`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    Authorization: `Token ${token}`
                },
                body: formData,
            })
            if (response.ok) {
                setShowComentarioModal(false)
                setNovoComentario("")
                fetchComentarios()
            } else {
                console.error('Erro ao enviar comentário:', await response.text())
            }
        } catch (error) {
            console.error('Erro ao enviar comentário:', error)
        }
    }

    const enviarAvaliacao = async () => {
        try {
            const formData = new FormData()
            formData.append('avaliacao', avaliacao)

            const response = await fetch(`https://api.nero.lat/api/postagem/${state.id}/avaliar/`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    Authorization: `Token ${token}`
                },
                body: formData,
            })
            if (response.ok) {
                setShowAvaliacaoModal(false)
                setAvaliacao(0)
            } else {
                console.error('Erro ao enviar avaliação:', await response.text())
            }
        } catch (error) {
            console.error('Erro ao enviar avaliação:', error)
        }
    }

    const alterarStatusReclama = async (status) => {
        try {
            const formData = new FormData()
            formData.append('novo_status', status)

            const response = await fetch(`https://api.nero.lat/api/postagem/${state.id}/atualizar-status/`, {
                method: 'PATCH',
                headers: {
                    accept: 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: formData,
            })

            if (response.ok) {
                console.log('Status alterado com sucesso')
            } else {
                console.error('Erro ao alterar status:', await response.text())
            }
        } catch (error) {
            console.error('Erro ao alterar status:', error)
        } finally {
            setLoadingR(false)
            setLoadingF(false)
            navigate('/home')
        }
    }

    const handleEditarPostagem = async () => {
        try {
            const formDataEditar = new FormData()
            formDataEditar.append('titulo', formData.titulo)
            formDataEditar.append('descricao', formData.descricao)
            formDataEditar.append('natureza', formData.natureza)
            if (formData.imagem) {
                formDataEditar.append('imagem', formData.imagem)
            }

            const response = await fetch(`https://api.nero.lat/api/postagem/${state.id}/`, {
                method: 'PATCH',
                headers: {
                    accept: 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: formDataEditar,
            })

            if (response.ok) {
                setShowEditarModal(false)
                // Atualize o estado local ou recarregue os dados da postagem
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

    useEffect(() => {
        if (state?.id) {
            fetchComentarios()
        }
    }, [state])

    if (!state) {
        return <div>Dados não encontrados</div>
    }

    const {
        nome,
        status,
        usuario,
        imagem,
        fotoPerfil,
        nomePerfil,
        data,
        hora,
        votos,
        descricao,
        natureza,
    } = state

    const statusMap = {
        "1": "pendente",
        "2": "resolvido",
        "3": "falso",
    }

    const naturezaMap = {
        "1": "infraestrutura",
        "2": "iluminação",
        "3": "coleta de lixo",
        "4": "saneamento",
        "5": "trânsito",
        "6": "outro",
    }

    const natureza_edit = [
        { id: '1', text: 'Infraestrutura', cor1: 'rgb(48,158,238)', cor2: 'rgb(75,136,181)' },
        { id: '2', text: 'Iluminação', cor1: 'rgb(243,221,51)', cor2: 'rgb(175,160,51)' },
        { id: '3', text: 'Coleta de Lixo', cor1: 'rgb(48,163,56)', cor2: 'rgb(48,86,50)' },
        { id: '4', text: 'Saneamento', cor1: 'rgb(173,100,48)', cor2: 'rgb(105,71,48)' },
        { id: '5', text: 'Transito', cor1: 'rgb(191,191,191)', cor2: 'rgb(122,122,122)' },
        { id: '6', text: 'Outro', cor1: 'rgb(242,242,242)', cor2: 'rgb(205,205,205)' },
    ]

    const statusConvertido = statusMap[status] || "não especificado"
    const naturezaConvertida = naturezaMap[natureza] || "não especificado"

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

    const renderAlertas = (votos) => {
        const max = 5
        const cheias = Math.min(parseInt(votos, 10), max)
        const vazias = max - cheias

        return (
            <>
                {Array(cheias)
                    .fill()
                    .map((_, index) => (
                        <PiSirenDuotone key={`cheias-${index}`} color='red' />
                    ))}
                {Array(vazias)
                    .fill()
                    .map((_, index) => (
                        <PiSirenDuotone key={`vazia-${index}`} color='gray' />
                    ))}
            </>
        )
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

    const isCurrentUser = parseInt(usuario) === parseInt(id)
    const isTipoOuvidoria = tipo === "ouvidoria"

    return (
        <div className='relative flex flex-col h-screen w-screen bg-[#e9e8e8] overflow-auto'>
            <div className='fixed top-0 flex items-center bg-white w-screen min-h-12 text-xl font-semibold shadow-inner gap-2 z-20'>
                <RiArrowLeftSLine className='ml-2' onClick={() => navigate(-1)} size={30} />
                <h1 className='shadow-2xl -mt-[2px]'>Detalhes da Postagem</h1>
            </div>
            <div className='fixed bottom-0 start-0'>
                <NavBar />
            </div>
            <div className='p-3 mt-10'>
                <div className='flex flex-col'>
                    <div className='flex justify-between rounded-t-lg py-3'>
                        <div className='flex gap-2'>
                            <img
                                className='h-10 w-10 rounded-full object-cover'
                                src={fotoPerfil}
                                alt={`Perfil de ${nomePerfil}`}
                            />
                            <div>
                                <h1 className='font-semibold text-xl -mb-1'>{nomePerfil}</h1>
                                <h1 className='font-[400] text-sm text-gray-400'>
                                    Relatando um problema de {nome}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-full relative'>
                        <div className='absolute top-0 start-0 text-xs p-1 px-2 text-white bg-[#022148] rounded-ee-lg rounded-ss-lg'>
                            <h1>Status: {statusConvertido}</h1>
                            <h1>Criado em: {data} às {hora}</h1>
                        </div>
                        <img
                            alt={`Imagem de ${nome}`}
                            src={imagem ? `https://api.nero.lat/${imagem}` : '/images/sem-imagem.png'}
                            className='w-full h-full rounded-t-lg'
                        />
                    </div>
                    <div className='flex justify-between items-center rounded-b-lg bg-white p-1'>
                        <div className='px-3 flex flex-col font-semibold'>
                            <p className='leading-4 my-2'>{descricao}</p>
                            <h1 className='flex'>Votos: <p className='font-normal ml-1 mt-[5px] flex'>{renderAlertas(votos)}</p></h1>
                            <h1 className='flex'>Natureza: <p className='font-normal ml-1 mb-3'>{naturezaConvertida}.</p></h1>
                        </div>
                    </div>
                </div>
                <h1 className='text-lg font-semibold mt-4'>Comentários</h1>
                <div className='flex overflow-auto gap-2'>
                    {comentarios.map((comentario) => (
                        <div key={comentario.id} className='h-full w-full mb-3'>
                            <Comentario
                                texto={comentario.texto}
                                usuario={comentario.usuario}
                            />
                        </div>
                    ))}
                </div>
                    {!isCurrentUser && (
                        !isTipoOuvidoria ? (
                            <div className='flex gap-2 mt-4 mb-[100px]'>
                                <button className='botao-estilo-1' onClick={() => setShowComentarioModal(true)}>
                                    Comentar
                                </button>
                                <button className='botao-estilo-2' onClick={() => setShowAvaliacaoModal(true)}>
                                    Avaliar
                                </button>
                            </div>
                        ) : (
                            <div className='flex gap-2 mt-4 mb-[100px]'>
                                <button className='botao-estilo-1' onClick={() => setShowComentarioModal(true)}>
                                    Comentar
                                </button>
                                <button disabled={loadingR} className='botao-estilo-1' onClick={() => { setLoadingF(true); alterarStatusReclama(3) }}>
                                    {loadingF ? <CircularProgress sx={{ mb: -0.5 }} size={20} color="inherit" /> : 'Reportar'}
                                </button>
                                <button disabled={loadingF} className='botao-estilo-2' onClick={() => { setLoadingR(true); alterarStatusReclama(2) }}>
                                    {loadingR ? <CircularProgress sx={{ mb: -0.5 }} size={20} color="inherit" /> : 'Resolver'}
                                </button>
                            </div>
                        )
                    )}
                    {isCurrentUser && (
                        <div className='flex gap-2 mt-4 mb-[100px]'>
                            <button className='botao-estilo-1' onClick={() => setShowEditarModal(true)}>
                                Editar
                            </button>
                        </div>
                    )}
            </div>
            <Modal open={showComentarioModal} onClose={() => setShowComentarioModal(false)}>
                <Box
                    sx={{
                        ...modalStyle,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={novoComentario}
                        onChange={(e) => setNovoComentario(e.target.value)}
                        placeholder="Escreva seu comentário aqui"
                        margin="normal"
                    />
                    <div style={{ alignSelf: 'flex-end', marginTop: '16px' }}>
                        <button className="botao-estilo-1 px-4" onClick={enviarComentario}>
                            Enviar
                        </button>
                    </div>
                </Box>
            </Modal>

            <Modal open={showAvaliacaoModal} onClose={() => setShowAvaliacaoModal(false)}>
                <Box
                    sx={{
                        ...modalStyle,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', justifyItems: 'center', marginBottom: '10px' }}>
                        {[1, 2, 3, 4, 5].map((nivel) => (
                            <PiSirenDuotone
                                key={nivel}
                                size={40}
                                color={nivel <= avaliacao ? 'red' : 'gray'}
                                onClick={() => setAvaliacao(nivel)}
                                style={{ cursor: 'pointer', margin: '0 8px' }}
                            />
                        ))}
                    </div>
                    <div style={{ alignSelf: 'flex', justifyContent: 'center', justifyItems: 'center' }}>
                        <button className="botao-estilo-1 px-4" onClick={enviarAvaliacao}>
                            Enviar
                        </button>
                    </div>
                </Box>
            </Modal>

            <Modal open={showEditarModal} onClose={() => setShowEditarModal(false)}>
                <Box
                    sx={{
                        ...modalStyle,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                    <div>
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

                    <div className="mt-4">
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

                    <div style={{ alignSelf: 'flex-end', marginTop: '16px' }}>
                        <button className="botao-estilo-1 px-4" onClick={handleEditarPostagem}>
                            Salvar
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default Detalhes