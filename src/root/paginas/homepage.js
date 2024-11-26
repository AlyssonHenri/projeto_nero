import React from 'react'
import { isBrowser } from 'react-device-detect'
import Miniatura from '../componentes/miniatura_post'
import Post from '../componentes/post'
import NavBar from '../componentes/nav_bar'

function Homepage() {
    if (isBrowser) {
        return (
            <div className='flex flex-col items-center justify-center h-screen w-screen'>
                Acesso indisponível, tente novamente em um celular
            </div>
        )
    }

    return (
        <div className='relative h-screen w-screen bg-[#e9e8e8]'>
            <div className='bottom-0 start-0 fixed'>
                <NavBar/>
            </div>
            <div className='flex flex-col p-3 '>
                <h1 className='font-semibold text-xl mb-3'>Minhas Postagens</h1>
                <div className='flex overflow-x-auto gap-4 pb-3'>
                    <Miniatura
                        tipo={'infraestrutura'}
                        nome={'Buraco na pista'}
                        status={'Resolvido'}
                        imagem={'https://th.bing.com/th/id/OIP.d1715p7WxUSmQZ1SFqyYnAHaE4?rs=1&pid=ImgDetMain'}
                    />
                    <Miniatura
                        tipo={'iluminacao'}
                        nome={'Rua com falta de energia'}
                        status={'Pendente'}
                        imagem={'https://araraquaraagora.com/images/noticias/11247/10035730_Img0_600x4.jpg'}
                    />
                    <Miniatura
                        tipo={'saneamento'}
                        nome={'Vazamento de água'}
                        status={'Pendente'}
                        imagem={'https://th.bing.com/th/id/OIP.qVC5Ja40b84FZ2t9iuLkhQHaFi?rs=1&pid=ImgDetMain'}
                    />
                    <Miniatura
                        tipo={'infraestrutura'}
                        nome={'Calçada danificada'}
                        status={'Resolvido'}
                        imagem={'https://thumbs.dreamstime.com/b/cal%C3%A7ada-quebrada-de-uma-%C3%A1rvore-ca%C3%ADda-desenraizada-ap%C3%B3s-tempestade-grande-sobre-e-o-gramado-em-um-bairro-residencial-concreto-159973906.jpg'}
                    />
                </div>
                <button className='botao-estilo-2 mt-2'>Criar Postagem</button>
                <h1 className='font-semibold text-xl mb-3 mt-5'>Feed de Postagens</h1>
                <div className='flex flex-col overflow-x-auto gap-4 pb-3 mb-16'>
                    <Post
                        id={1}
                        nome={'Buraco na pista'}
                        status={'Resolvido'}
                        descricao={'Um buraco grande na pista principal, causando transtornos aos motoristas.'}
                        natureza={'Infraestrutura'}
                        imagem={'https://th.bing.com/th/id/OIP.d1715p7WxUSmQZ1SFqyYnAHaE4?rs=1&pid=ImgDetMain'}
                        fotoPerfil={'https://th.bing.com/th/id/OIP.yRXdPSQF1E577bhjXeXsAgHaEx?rs=1&pid=ImgDetMain'}
                        perfil={'Manoel Gomes'}
                        data={'13/11/2024'}
                        hora={'14:35'}
                        votos={'37'}
                        estrelas={3}
                    />
                    <Post
                        id={2}
                        nome={'Semáforo quebrado'}
                        status={'Pendente'}
                        descricao={'Semáforo fora de funcionamento em um cruzamento movimentado, causando confusão no trânsito.'}
                        natureza={'Transporte'}
                        imagem={'https://th.bing.com/th/id/OIP.ET4BsPHcCa5rpgVeuT3-kgHaFU?rs=1&pid=ImgDetMain'}
                        fotoPerfil={'https://i.ytimg.com/vi/SblMVGJhRcI/maxresdefault.jpg'}
                        perfil={'Purple Pencil'}
                        data={'12/11/2024'}
                        hora={'08:20'}
                        votos={'15'}
                        estrelas={4}
                    />
                    <Post
                        id={3}
                        nome={'Árvore caída'}
                        status={'Pendente'}
                        descricao={'Árvore tombada após tempestade, bloqueando parcialmente a calçada e parte da rua.'}
                        natureza={'Meio Ambiente'}
                        imagem={'https://www.publicdomainpictures.net/pictures/500000/velka/fallen-tree-1677505775h8u.jpg'}
                        fotoPerfil={'https://th.bing.com/th/id/OIP.OpULB7dXNSqqBm1oiKcAswHaE8?rs=1&pid=ImgDetMain'}
                        perfil={'Blue Pencil'}
                        data={'10/11/2024'}
                        hora={'19:15'}
                        votos={'10'}
                        estrelas={2}
                    />
                    <Post
                        id={4}
                        nome={'Lixo acumulado'}
                        status={'Resolvido'}
                        descricao={'Acúmulo de lixo em um terreno baldio, trazendo mau cheiro e atraindo pragas.'}
                        natureza={'Saúde Pública'}
                        imagem={'https://th.bing.com/th/id/R.d05781cce3b3dbb6a9084e31cc7dbf08?rik=Hb6JkkZzMWgfJw&riu=http%3a%2f%2ff.i.uol.com.br%2ffotografia%2f2014%2f12%2f30%2f469684-970x600-1.jpeg&ehk=pHRmZBeGdUbwz%2btyoSTBS2AfF%2fqi3NlcFW%2bKxh0r1Y0%3d&risl=&pid=ImgRaw&r=0'}
                        fotoPerfil={'https://i.kym-cdn.com/photos/images/newsfeed/002/500/259/b8d.jpg'}
                        perfil={'Blue Jouki'}
                        data={'11/11/2024'}
                        hora={'16:50'}
                        votos={'22'}
                        estrelas={5}
                    />
                </div>
            </div>
        </div>
    )
}

export default Homepage