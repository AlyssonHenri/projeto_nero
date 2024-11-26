import React from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../componentes/nav_bar';

function Detalhes() {
    const { state } = useLocation();

    if (!state) {
        return <div>Dados não encontrados</div>;
    }

    const { nome, status, imagem, fotoPerfil, perfil, data, hora, votos, estrelas, descricao, natureza } = state;

    return (
        <div className='relative flex flex-col h-screen w-screen bg-[#e9e8e8] overflow-auto'>
            <div className='flex items-center bg-white w-screen min-h-12 text-xl font-semibold shadow-inner'>
                <h1 className='ml-5 shadow-2xl'>Detalhes da Postagem </h1>   
            </div> 
            <div className='p-3'>     
                <div className='bottom-0 start-0 absolute'>
                    <NavBar/>
                </div> 
                <div className='flex flex-col '>
                    <div className='flex justify-between rounded-t-lg py-3'>
                        <div className='flex gap-2'>
                            <img className='h-10 w-10 rounded-full object-cover' src={fotoPerfil} alt={`Perfil de ${perfil}`} />
                            <div>
                                <h1 className='font-semibold text-xl -mb-1'>{perfil}</h1>
                                <h1 className='font-[400] text-sm text-gray-400'>
                                    Relatando um problema de {nome}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <h1 className='font-semibold text-xl'>Informações sobre a reclamação</h1>
                        <h1 className='font-[400] text-sm text-gray-400 -mt-1 mb-2'>Local: Centro Aracati</h1>
                    </div>
                    <div className='w-full h-full relative'>
                        <div className='absolute top-0 start-0 text-xs p-1 px-2 text-white bg-[#022148] rounded-ee-lg rounded-ss-lg'>
                            <h1>Status: {status}</h1>
                            <h1>Criado em: {data} as {hora}</h1>
                        </div>
                        <img alt={`Imagem de ${nome}`} src={imagem} className='w-full h-full rounded-t-lg' />
                    </div>
                    <div className='flex justify-between items-center rounded-b-lg bg-white p-1'>
                        <div className='px-3 flex flex-col font-semibold '>
                            <p className='leading-4 my-2'>{descricao}</p>
                            <h1 className='flex'>Votos: <p className='font-normal ml-1'>{votos} votos</p></h1>
                            <h1 className='flex'>Natureza: <p className='font-normal ml-1 mb-3'>{natureza}.</p></h1>
                        </div>
                    </div>
                </div>
                <h1 className='text-lg font-semibold mt-4'>Comentários</h1>
                <div className='flex gap-2 mt-1'>
                    <button className='botao-estilo-1'>
                        Comentar
                    </button>
                    <button className='botao-estilo-2'>
                        Avaliar
                    </button>
                </div>
                <h1 className='text-lg font-semibold mt-4'>Atividades Recentes</h1>
            </div>
        </div>
    );
}

export default Detalhes;
