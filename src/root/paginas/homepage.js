import React, { useEffect, useState } from 'react';
import { isBrowser } from 'react-device-detect';
import Miniatura from '../componentes/miniatura_post';
import Post from '../componentes/post';
import NavBar from '../componentes/nav_bar';

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
    const [miniaturas, setMiniaturas] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loadingMiniaturas, setLoadingMiniaturas] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        fetch('../jsons/miniaturas.json')
            .then(response => response.json())
            .then(data => {
                setMiniaturas(data);
                setLoadingMiniaturas(false);
            })
            .catch(error => console.error('Erro ao carregar miniaturas:', error));

        fetch('../jsons/posts.json')
            .then(response => response.json())
            .then(data => {
                setPosts(data);
                setLoadingPosts(false);
            })
            .catch(error => console.error('Erro ao carregar posts:', error));
    }, []);

    if (isBrowser) {
        return (
            <div className='flex flex-col items-center justify-center h-screen w-screen'>
                Acesso indisponível, tente novamente em um celular
            </div>
        );
    }

    return (
        <div className='relative h-full min-h-screen w-screen bg-[#e9e8e8]'>
            <div className='bottom-0 start-0 fixed z-50'>
                <NavBar />
            </div>
            <div className='flex flex-col p-3 '>
                <h1 className='font-semibold text-xl mb-3'>Minhas Postagens</h1>
                <div className='flex overflow-x-auto gap-4 pb-3'>
                    {loadingMiniaturas
                        ? Array.from({ length: 2 }).map((_, index) => (
                              <SkeletonMiniatura key={index} />
                          ))
                        : miniaturas.map((miniatura, index) => (
                              <Miniatura
                                  key={index}
                                  tipo={miniatura.tipo}
                                  nome={miniatura.nome}
                                  status={miniatura.status}
                                  imagem={miniatura.imagem}
                              />
                          ))}
                </div>
                <button className='botao-estilo-2 mt-2'>Criar Postagem</button>
                <h1 className='font-semibold text-xl mb-3 mt-5'>Feed de Postagens</h1>
                <div className='flex flex-col overflow-x-auto gap-4 pb-3 mb-16'>
                    {loadingPosts
                        ? Array.from({ length: 3 }).map((_, index) => (
                              <SkeletonPost key={index} />
                          ))
                        : posts.map(post => (
                              <Post
                                  key={post.id}
                                  id={post.id}
                                  nome={post.nome}
                                  status={post.status}
                                  descricao={post.descricao}
                                  natureza={post.natureza}
                                  imagem={post.imagem}
                                  fotoPerfil={post.fotoPerfil}
                                  perfil={post.perfil}
                                  data={post.data}
                                  hora={post.hora}
                                  votos={post.votos}
                                  estrelas={post.estrelas}
                              />
                          ))}
                </div>
            </div>
        </div>
    );
}

export default Homepage;
