import React, { useEffect, useState } from 'react'
import { isBrowser } from 'react-device-detect'
import Miniatura from '../componentes/miniatura_post'
import Post from '../componentes/post'
import NavBar from '../componentes/nav_bar'
import { useNavigate } from 'react-router-dom'
import { Box, Divider } from '@mui/material'

function SkeletonMiniatura() {
    return (
        <div>
            {isBrowser ? (
                <div className='animate-pulse w-[28%] h-96 bg-gray-300 rounded-md'></div>
            ) : (
                <div className='animate-pulse w-[48%] h-48 bg-gray-300 rounded-md'></div>
            )}
        </div>
    )
}

function SkeletonPost() {
    return (
        <div className='animate-pulse h-[384px] flex flex-col gap-2 p-4 bg-gray-300 rounded-lg'>
            <div className='flex justify-between'>
                <div className='flex w-[90%]'>
                    <div className='w-12 h-12 bg-gray-400 rounded-full'></div>
                    <div className='w-2/4'>
                        <div className='my-2 ml-2 mr-14 h-4 bg-gray-400 rounded'></div>
                        <div className='my-2 ml-2 mr-8 h-4 bg-gray-400 rounded'></div>
                    </div>
                </div>
                <div className='w-1/4'>
                    <div className='my-2 ml-2 h-4 bg-gray-400 rounded'></div>
                    <div className='my-2 ml-2 h-4 bg-gray-400 rounded'></div>
                </div>
            </div>
            <div className='h-full w-full bg-gray-400 rounded'></div>
            <div className='flex justify-between'>
                <div className='w-2/4'>
                    <div className='my-2 ml-2 h-4 bg-gray-400 rounded'></div>
                    <div className='my-2 ml-2 h-4 bg-gray-400 rounded'></div>
                </div>
                <div className='w-1/4 mt-2'>
                    <div className='my-2 ml-2 h-7 bg-gray-400 rounded'></div>
                </div>
            </div>
        </div>
    )
}

function Homepage() {
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('id')
    const tipo = localStorage.getItem('tipo')
    const [perfil, setPerfil] = useState()
    const navigate = useNavigate()
    const [miniaturas, setMiniaturas] = useState([])
    const [posts, setPosts] = useState([])
    const [loadingMiniaturas, setLoadingMiniaturas] = useState(true)
    const [loadingPosts, setLoadingPosts] = useState(true)

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch(`https://api.nero.lat/api/usuario/${id}/`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error('Erro ao buscar os dados do usuário')
            }

            const data = await response.json()
            setPerfil(data)
        }

        fetchUserData()
        fetchMinis()
        fetchPosts()

        const interval = setInterval(() => {
            fetchPosts()
        }, 30000) // 30 segundos

        return () => clearInterval(interval)
    }, [id])

    const fetchMinis = async () => {
        try {
            const response = await fetch('https://api.nero.lat/api/postagem/', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            })

            if (response.ok) {
                const data = await response.json()
                setMiniaturas(data.reverse())
            } else {
                console.error(`Erro ao carregar miniaturas: ${response.status}`)
            }
        } catch (error) {
            console.error('Erro de conexão ao carregar miniaturas:', error)
        } finally {
            setLoadingMiniaturas(false)
        }
    }

    const fetchPosts = async () => {
        try {
            const response = await fetch('https://api.nero.lat/api/feed/', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            })

            if (response.ok) {
                const data = await response.json()
                console.log(data)
                setPosts(data.reverse())
            } else {
                console.error(`Erro ao carregar posts: ${response.status}`)
            }
        } catch (error) {
            console.error('Erro de conexão ao carregar posts:', error)
        } finally {
            setLoadingPosts(false)
        }
    }

    const handleImageError = (event) => {
        event.target.src = '/images/sem-imagem.png'
    }

    if (isBrowser) {
        return (
            <div className='relative h-full min-h-screen w-screen '>
                <div className='flex flex-col'>
                    { tipo === "cidadão" &&
                        <>
                            <NavBar imgPerfil={perfil?.foto_perfil}/>
                            <div className='flex items-center justify-between px-[10%] mt-6 mb-6'>
                                <div className='flex items-center justify-between'>
                                    <img 
                                        onClick={() => navigate('/perfil')} 
                                        src={perfil?.foto_perfil ? `https://api.nero.lat${perfil.foto_perfil}` : '/images/sem-imagem.png'} 
                                        className='h-24 w-24 rounded-full mr-3 object-cover' 
                                        alt='foto_perfil'
                                        onError={handleImageError}
                                    />
                                    <h1 className='text-xl font-semibold'>{perfil?.first_name || ''}</h1>
                                </div>
                                <div className='w-72'>
                                    <button className='botao-estilo-2' onClick={() => navigate('/post/novo')}>Criar Postagem</button>
                                </div>
                            </div>
                            <Divider />
                            <div className='px-[10%] mt-8'>
                                <h1 className='font-semibold text-3xl mb-3'>Minhas Postagens</h1>
                                <div className='flex w-full overflow-x-auto gap-4 pb-3 mb-5'>
                                    {loadingMiniaturas
                                        ? Array.from({ length: 2 }).map((_, index) => (
                                            <SkeletonMiniatura key={index} />
                                        ))
                                        : miniaturas.filter(miniatura => miniatura.usuario !== null).map((miniatura, index) => (
                                            <Miniatura
                                                key={index}
                                                id={miniatura.id}
                                                titulo={miniatura.titulo}
                                                status={miniatura.status}
                                                imagem={miniatura.imagem}
                                                tipo={miniatura.natureza}
                                                perfil={miniatura.usuario}
                                                criacao={miniatura.criacao}
                                                votos={miniatura.votos}
                                                descricao={miniatura.descricao}
                                                natureza={miniatura.natureza}
                                            />
                                        ))}
                                </div>
                            </div>
                            <Divider />
                            <Box className='px-[10%] max-w-screen mt-8'>
                                <h1 className='font-semibold text-3xl mb-3'>Feed de Postagens</h1>
                                <div className='flex flex-col  gap-10 pb-3 mb-16'>
                                    { posts.map(post => (
                                        <Post
                                            key={post.id}
                                            id={post.id}
                                            usuario={post.usuario}
                                            titulo={post.titulo}
                                            status={post.status}
                                            imagem={post.imagem}
                                            perfil={post.usuario}
                                            criacao={post.criacao}
                                            votos={post.votos}
                                            descricao={post.descricao}
                                            natureza={post.natureza}
                                        />
                                    ))}
                                </div>
                            </Box>
                        </>
                    }
                </div>
            </div>
        )
    }

    return (
        <div className='relative h-full min-h-screen w-screen bg-[#e9e8e8]'>
            <NavBar />
            <div className='flex flex-col p-3'>
            { tipo === "cidadão" &&
                <>
                    <h1 className='font-semibold text-xl mb-3'>Minhas Postagens</h1>
                    <div className='flex w-full overflow-x-auto gap-4 pb-3'>
                        {loadingMiniaturas
                            ? Array.from({ length: 2 }).map((_, index) => (
                                <SkeletonMiniatura key={index} />
                            ))
                            : miniaturas.filter(miniatura => miniatura.usuario !== null).map((miniatura, index) => (
                                <Miniatura
                                    key={index}
                                    id={miniatura.id}
                                    usuario={miniatura.usuario}
                                    titulo={miniatura.titulo}
                                    status={miniatura.status}
                                    imagem={miniatura.imagem}
                                    tipo={miniatura.natureza}
                                    perfil={miniatura.usuario}
                                    criacao={miniatura.criacao}
                                    votos={miniatura.votos}
                                    descricao={miniatura.descricao}
                                    natureza={miniatura.natureza}
                                />
                            ))}
                    </div>
                    <button className='botao-estilo-2 mt-2' onClick={() => navigate('/post/novo')}>Criar Postagem</button>
                </>
            }
                <h1 className='font-semibold text-xl mb-3 mt-5'>Feed de Postagens</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-3 mb-16'>
                    {loadingPosts
                        ? Array.from({ length: 4 }).map((_, index) => (
                              <SkeletonPost key={index} />
                          ))
                        : posts.map(post => (
                              <Post
                                  key={post.id}
                                  id={post.id}
                                  titulo={post.titulo}
                                  usuario={post.usuario}
                                  status={post.status}
                                  imagem={post.imagem}
                                  perfil={post.usuario}
                                  criacao={post.criacao}
                                  votos={post.votos}
                                  descricao={post.descricao}
                                  natureza={post.natureza}
                              />
                          ))}
                </div>
            </div>
        </div>
    )
}

export default Homepage