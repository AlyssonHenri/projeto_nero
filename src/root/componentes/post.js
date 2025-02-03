import React, { useEffect, useState } from 'react'
import { isBrowser } from 'react-device-detect'
import { PiSirenDuotone } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import Comentario from './comentario'
import Editar from './editar'
import { Box, CircularProgress, Modal, TextField } from '@mui/material'

const Post = React.forwardRef(({ id }, ref) => {
    const token = localStorage.getItem('token')
    const user_id = localStorage.getItem('id')
    const tipo = localStorage.getItem('tipo')
    const navigate = useNavigate()
    const [novoComentario, setNovoComentario] = useState("")
    const [avaliacao, setAvaliacao] = useState(0)
    const [showComentarioModal, setShowComentarioModal] = useState(false)
    const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false)
    const [showEditarModal, setShowEditarModal] = useState(false)
    const [loadingF, setLoadingF] = useState(false)
    const [loadingR, setLoadingR] = useState(false)
    const [perfilData, setPerfilData] = useState(null)
    const [comentarios, setComentarios] = useState([])
    const [postagem, setPostagem] = useState(null)
    const statusInfo = {
        1: { emoji: '🔴', texto: 'Pendente' },
        2: { emoji: '🟢', texto: 'Resolvido' },
        3: { emoji: '⚠️', texto: 'Falsa' },
    }

    const fetchPostagem = async () => {
        try {
            const response = await fetch(`https://api.nero.lat/api/postagem/${id}/`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            })
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`)
            }
            const data = await response.json()
            setPostagem(data)
        } catch (error) {
            console.error('Erro ao buscar os dados da postagem:', error)
        }
    }

    const fetchPerfilData = async () => {
        try {
            const response = await fetch(`https://api.nero.lat/api/usuario/${postagem?.usuario}/`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            })
            const data = await response.json()
            setPerfilData(data)
        } catch (error) {
            console.error('Erro ao buscar os dados do perfil:', error)
        }
    }

    const fetchComentarios = async () => {
        try {
            const response = await fetch(`https://api.nero.lat/api/postagem/${id}/comentarios/`, {
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

    useEffect(() => {
        const fetchData = async () => {
            await fetchPostagem()   
        }
        fetchData()
    }, [id])
    
    useEffect(() => {
        if (postagem?.usuario) {
            fetchPerfilData()
            fetchComentarios()
        }
    }, [postagem])

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

    const enviarComentario = async () => {
        try {
            const formData = new FormData()
            formData.append('texto', novoComentario)
            formData.append('postagem', id)

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

            const response = await fetch(`https://api.nero.lat/api/postagem/${id}/avaliar/`, {
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
    
            const response = await fetch(`https://api.nero.lat/api/postagem/${id}/atualizar-status/`, {
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
            window.location.reload()
        }
    }

    const renderAlertas = (votos = 0) => {
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

    const dataCriacao = new Date(postagem?.criacao)
    const data = dataCriacao.toLocaleDateString()
    const hora = dataCriacao.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const { emoji, texto } = statusInfo[postagem?.status] || statusInfo[1]
    const fotoPerfil = perfilData?.foto_perfil ? `https://api.nero.lat/${perfilData.foto_perfil}` : '/images/sem-foto.png'
    const nomePerfil = perfilData?.first_name || 'Anônimo'
    const isCurrentUser = parseInt(postagem?.usuario) === parseInt(user_id)
    const isTipoOuvidoria = tipo === "ouvidoria"

    if (isBrowser) {
        return (
            <div ref={ref} className='flex bg-white rounded-lg h-[500px] overflow-hidden shadow-md'>
                <div className='w-[60%]'>
                    <div className='flex justify-between bg-white rounded-t-lg p-3'>
                        <div className='flex gap-2'>
                            <img 
                                className='h-10 w-10 rounded-full object-cover' 
                                src={fotoPerfil} 
                                alt={`Perfil de ${nomePerfil}`} 
                            />
                            <div>
                                <h1 className='font-semibold text-xl -mb-1 truncate w-[70%]'>{nomePerfil}</h1>
                                <h1 className='font-[400] text-sm text-gray-400'>
                                    Criado em: {data} às {hora}
                                </h1>
                            </div>
                        </div>
                        
                    </div>
                    <div className={`w-full h-full`}>
                        <img 
                            alt={`Imagem de ${nomePerfil}`} 
                            src={postagem?.imagem ? `https://api.nero.lat/${postagem?.imagem}` : '/images/sem-imagem.png'}
                            className='w-full h-full object-cover' 
                        />
                    </div>
                </div>
                <div className='flex flex-col rounded-b-lg w-full py-5 px-8'>

                    <div className='flex justify-between items-center'>
                        <div className='flex flex-col font-semibold '>
                            <div className='flex  mb-1'>
                                <h1>{emoji}</h1>
                                <div className='flex flex-col'>
                                    <h1 className='ml-1'>{texto}</h1>
                                    <h1 className='text-sm font-normal ml-1 truncate'>{postagem?.titulo}</h1>
                                </div>
                            </div>
                        </div>
                        <div className='flex'>{renderAlertas(postagem?.votos)}</div>
                    </div>

                    <div className='flex flex-col mt-3'>
                        <h1 className='font-semibold'>Descricao</h1>
                        <h1>{postagem?.descricao}</h1>
                    </div>

                    {comentarios.length > 0 && <h1 className='font-semibold mt-3'>Comentários</h1>}
                    <div className='flex flex-col overflow-auto gap-2'>
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
                                <button disabled={loadingR} className='botao-estilo-1' onClick={() => { setLoadingF(true); alterarStatusReclama(3); }}>
                                    {loadingF ? <CircularProgress sx={{ mb: -0.5 }} size={20} color="inherit" /> : 'Reportar'}
                                </button>
                                <button disabled={loadingF} className='botao-estilo-2' onClick={() => { setLoadingR(true); alterarStatusReclama(2); }}>
                                    {loadingR ? <CircularProgress sx={{ mb: -0.5 }} size={20} color="inherit" /> : 'Resolver'}
                                </button>
                            </div>
                        )
                    )}
                    {isCurrentUser && (
                        <div className='flex gap-2 mt-4 mb-[100px]'>
                            <button className='botao-estilo-1' onClick={() => setShowComentarioModal(true)}>
                                Comentar
                            </button>
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

                {postagem && 
                    <Editar
                        id={postagem?.id}
                        setShowEditarModal={setShowEditarModal}
                        showEditarModal={showEditarModal}
                        titulo={postagem?.titulo}
                        descricao={postagem?.descricao}
                        natureza={postagem?.natureza}
                        funcUpdate={fetchPostagem}
                    />
                }
            </div>
        )
    }
    
    return (
        <div className='flex flex-col w-full max-w-[400px] bg-white rounded-lg overflow-hidden shadow-md'>
            <div className='flex justify-between bg-white rounded-t-lg p-3'>
                <div className='flex gap-2'>
                    <img 
                        className='h-10 w-10 rounded-full object-cover' 
                        src={fotoPerfil} 
                        alt={`Perfil de ${nomePerfil}`} 
                    />
                    <div>
                        <h1 className='font-semibold text-xl -mb-1 truncate w-[70%]'>{nomePerfil}</h1>
                        <h1 className='font-[400] text-sm text-gray-400'>
                            Criado em: {data} às {hora}
                        </h1>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <div className='flex'>{renderAlertas(postagem?.votos)}</div>
                </div>
            </div>
            <div className={`w-full h-full`}>
                <img 
                    alt={`Imagem de ${nomePerfil}`} 
                    src={postagem?.imagem ? `https://api.nero.lat/${postagem?.imagem}` : '/images/sem-imagem.png'}
                    className='w-full h-full object-cover' 
                />
            </div>
            <div className='flex justify-between items-center rounded-b-lg bg-white p-1'>
                <div className='px-3 flex flex-col font-semibold '>
                    <h1 className='text-sm mt-1 truncate'>{postagem?.titulo}</h1>
                    <div className='flex items-center mb-1'>
                        <h1>{emoji}</h1>
                        <h1 className='ml-1'>{texto}</h1>
                    </div>
                </div>
                <button
                    onClick={() => {
                        navigate(`/post/${id}`, {
                            state: { 
                                id, 
                                titulo: postagem.titulo, 
                                nome: postagem.nome, 
                                usuario: postagem.usuario, 
                                status: postagem.status, 
                                imagem: postagem.imagem, 
                                fotoPerfil, 
                                nomePerfil, 
                                data, 
                                hora, 
                                votos: postagem.votos, 
                                descricao: postagem.descricao, 
                                natureza: postagem.natureza 
                            }
                        })
                    }}
                    className='botao-estilo-3 px-3 h-8 mr-2'
                >
                    Detalhes
                </button>
            </div>
        </div>
    )
})

export default Post