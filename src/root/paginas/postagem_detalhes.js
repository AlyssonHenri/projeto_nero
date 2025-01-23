import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavBar from '../componentes/nav_bar'
import Comentario from '../componentes/comentario'
import { RiArrowLeftSLine } from 'react-icons/ri'
import { PiSirenDuotone } from 'react-icons/pi'
import { Modal, Box, TextField, } from '@mui/material'

function Detalhes() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const [comentarios, setComentarios] = useState([])
    const [showComentarioModal, setShowComentarioModal] = useState(false)
    const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false)
    const [novoComentario, setNovoComentario] = useState("")
    const [avaliacao, setAvaliacao] = useState(0)
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

    const isCurrentUser = () => parseInt(usuario) === parseInt(id)
    const isTipoOuvidoria = () => tipo === "ouvidoria"

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
                { !isCurrentUser() && (
                    !isTipoOuvidoria() ? (
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
                            <button className='botao-estilo-1' >
                                Comentar
                            </button>
                            <button className='botao-estilo-1' >
                                Reportar
                            </button>
                            <button className='botao-estilo-2' >
                                Resolver
                            </button>
                        </div>
                    )
                )}
            </div>
            {/* Modal de Comentários */}
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

            {/* Modal de Avaliação */}
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
        </div>
    )
}

export default Detalhes