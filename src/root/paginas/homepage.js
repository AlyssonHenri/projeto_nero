import React, { useEffect, useState } from 'react'
import { isBrowser } from 'react-device-detect'
import Miniatura from '../componentes/miniatura_post'
import Post from '../componentes/post'
import NavBar from '../componentes/nav_bar'
import { useNavigate } from 'react-router-dom'

function SkeletonMiniatura() {
    return (
        <div className='animate-pulse w-[48%] h-48 bg-gray-300 rounded-md'></div>
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
    const navigate = useNavigate()
    const [miniaturas, setMiniaturas] = useState([])
    const [posts, setPosts] = useState([])
    const [loadingMiniaturas, setLoadingMiniaturas] = useState(true)
    const [loadingPosts, setLoadingPosts] = useState(true)

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
                setMiniaturas(data)
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

    useEffect(() => {
        fetchMinis()
        fetchPosts()

        const interval = setInterval(() => {
            fetchPosts()
        }, 30000) // Atualiza a cada 30 segundos

        return () => clearInterval(interval) // Limpa o intervalo ao desmontar
    }, [])

    if (isBrowser) {
        return (
            <div className='flex flex-col items-center justify-center h-screen w-screen'>
                Acesso indisponível, tente novamente em um celular
            </div>
        )
    }

    return (
        <div className='relative h-full min-h-screen w-screen bg-[#e9e8e8]'>
            <div className='bottom-0 start-0 fixed z-50'>
                <NavBar />
            </div>
            <div className='flex flex-col p-3'>
                <h1 className='font-semibold text-xl mb-3'>Minhas Postagens</h1>
                <div className='flex w-full overflow-x-auto gap-4 pb-3'>
                    {loadingMiniaturas
                        ? Array.from({ length: 2 }).map((_, index) => (
                              <SkeletonMiniatura key={index} />
                          ))
                        : miniaturas.map((miniatura, index) => (
                              <Miniatura
                                  key={index}
                                  tipo={miniatura.natureza}
                                  nome={miniatura.titulo}
                                  status={miniatura.status}
                                  imagem={miniatura.imagem}
                              />
                          ))}
                </div>
                <button className='botao-estilo-2 mt-2' onClick={() => navigate('/post/novo')}>Criar Postagem</button>
                <h1 className='font-semibold text-xl mb-3 mt-5'>Feed de Postagens</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-3 mb-16'>
                    {loadingPosts
                        ? Array.from({ length: 3 }).map((_, index) => (
                              <SkeletonPost key={index} />
                          ))
                        : posts.map(post => (
                              <Post
                                  key={post.id}
                                  id={post.id}
                                  nome={post.titulo}
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