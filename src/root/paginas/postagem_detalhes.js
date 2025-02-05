import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import NavBar from '../componentes/nav_bar'
import Comentario from '../componentes/comentario'
import Editar from '../componentes/editar'
import { RiArrowLeftSLine } from 'react-icons/ri'
import { PiSirenDuotone } from 'react-icons/pi'
import { Modal, Box, TextField, CircularProgress, Typography } from '@mui/material'
import { isBrowser } from 'react-device-detect'

function Detalhes() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [comentarios, setComentarios] = useState([])
    const [showComentarioModal, setShowComentarioModal] = useState(false)
    const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false)
    const [showEditarModal, setShowEditarModal] = useState(false)
    const [novoComentario, setNovoComentario] = useState("")
    const [avaliacao, setAvaliacao] = useState(0)
    const [loadingF, setLoadingF] = useState(false)
    const [loadingR, setLoadingR] = useState(false)
    const [postagem, setPostagem] = useState(null)
    const [showDeletarModal, setShowDeletarModal] = useState(false)
    const [perfilData, setPerfilData] = useState(null)
    const token = localStorage.getItem('token')
    const id_user = localStorage.getItem('id')
    const tipo = localStorage.getItem('tipo')
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
            navigate('/home')
        }
    }

    const enviarFormulario = async () => {
        try{
            const response = await fetch(`https://api.nero.lat/api/postagem/${id}/enviar-formulario/`,{
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    Authorization: `Token ${token}`,
                }
            })
            if(response.ok){
                console.log('Formulário enviado com sucesso')
                alert('Formulário enviado com sucesso para ouvidouria local.')
            } else {
                alert('Complete seus dados pessoais para enviar formularios de reclamação.')
            }
        }catch(error){
            console.error('Erro ao enviar formulário:', error)
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

    const statusMap = {
        "1": "pendente",
        "2": "resolvido",
        "3": "falso",id_user
    }

    const naturezaMap = {
        "1": "infraestrutura",
        "2": "iluminação",
        "3": "coleta de lixo",
        "4": "saneamento",
        "5": "trânsito",
        "6": "outro",
    }

    const statusConvertido = statusMap[postagem?.status] || "não especificado"
    const naturezaConvertida = naturezaMap[postagem?.natureza] || "não especificado"

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

    const deletarPostagem = async () => {
        try{
            const response = await fetch(`https://api.nero.lat/api/postagem/${id}`,{
                method: 'DELETE',
                headers: {
                    accept: 'application/json',
                    Authorization: `Token ${token}`,
                }
            })
            if(!response.ok){
                alert('Não foi possivel deletar sua postagem, tente novamete mais tarde.')
            }
        }catch(error){
            console.error('Erro ao enviar formulário:', error)
        } finally {
            setShowDeletarModal(false)
            window.reload()
        }
    }
    
    const dataCriacao = new Date(postagem?.criacao)
    const data = dataCriacao.toLocaleDateString()
    const hora = dataCriacao.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const fotoPerfil = perfilData?.foto_perfil ? `https://api.nero.lat/${perfilData.foto_perfil}` : '/images/sem-foto.png'
    const nomePerfil = perfilData?.first_name || 'Anônimo'
    const isCurrentUser = parseInt(postagem?.usuario) === parseInt(id_user)
    const isTipoOuvidoria = tipo === "ouvidoria"
    const { emoji, texto } = statusInfo[postagem?.status] || statusInfo[1]

    if (isBrowser) {
        return (
            <div>
                <div className='fixed top-0 start-0'>
                    <NavBar />
                </div>
                <div className='flex mt-20 bg-white h-[60%] overflow-hidden '>
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
                    <div className='flex flex-col w-full py-5 px-8'>

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
                                <button className='botao-estilo-1' onClick={() => setShowDeletarModal(true)}>
                                    Deletar
                                </button>
                                <button className='botao-estilo-2' onClick={() => enviarFormulario()}>
                                    Enviar Formulario
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

                    <Modal open={showDeletarModal} onClose={() => setShowDeletarModal(false)}>
                        <Box
                            sx={{
                                ...modalStyle,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant='h6'>Deseja mesmo deletar a postagem?</Typography>
                            <div className='flex mt-3 w-full gap-10 justify-between'>
                                <button className="botao-estilo-1 px-4" onClick={() => deletarPostagem()}>
                                    Sim
                                </button>
                                <button className="botao-estilo-2 px-4" onClick={() => setShowDeletarModal(false)}>
                                    Não
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
            </div>
        )
    }

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
                                src={`${fotoPerfil}`}
                                alt={`Perfil de ${nomePerfil}`}
                            />
                            <div>
                                <h1 className='font-semibold text-xl -mb-1'>{nomePerfil}</h1>
                                <h1 className='font-[400] text-sm text-gray-400'>
                                    Relatando um problema de {naturezaConvertida}
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
                            alt={`Imagem de ${nomePerfil}`}
                            src={postagem?.imagem ? `https://api.nero.lat/${postagem?.imagem}` : '/images/sem-imagem.png'}
                            className='w-full h-full rounded-t-lg'
                        />
                    </div>
                    <div className='flex justify-between items-center rounded-b-lg bg-white p-1'>
                        <div className='px-3 flex flex-col font-semibold'>
                            <p className='leading-4 my-2'>{postagem?.descricao}</p>
                            <h1 className='flex'>Votos: <p className='font-normal ml-1 mt-[5px] flex'>{renderAlertas(postagem?.votos)}</p></h1>
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
                            <div className='w-[50%]'>
                                <button className='botao-estilo-1' onClick={() => setShowComentarioModal(true)}>
                                    Comentar
                                </button>
                                <button className='botao-estilo-1 mt-2' onClick={() => setShowEditarModal(true)}>
                                    Editar
                                </button>
                            </div>
                            <div className='w-[50%]'>
                                <button className='botao-estilo-1' onClick={() => setShowDeletarModal(true)}>
                                    Deletar
                                </button>
                                <button className='botao-estilo-2 mt-2' onClick={() => enviarFormulario()}>
                                    Enviar Formulário
                                </button>
                            </div>
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

            <Modal open={showDeletarModal} onClose={() => setShowDeletarModal(false)}>
                <Box
                    sx={{
                        ...modalStyle,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant='h6'>Deseja mesmo deletar a postagem?</Typography>
                    <div className='flex mt-3 w-full gap-10 justify-between'>
                        <button className="botao-estilo-1 px-4" onClick={() => deletarPostagem()}>
                            Sim
                        </button>
                        <button className="botao-estilo-2 px-4" onClick={() => setShowDeletarModal(false)}>
                            Não
                        </button>
                    </div>
                </Box>
            </Modal>

            {postagem && 
                <Editar
                    id={id}
                    setShowEditarModal={setShowEditarModal}
                    showEditarModal={showEditarModal}
                    titulo={postagem.titulo}
                    descricao={postagem.descricao}
                    natureza={postagem.natureza}
                />
            }
        </div>
    )
}

export default Detalhes