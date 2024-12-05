import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../componentes/nav_bar';
import Comentario from '../componentes/comentario';
import { PiArrowLeftBold } from 'react-icons/pi';

function Detalhes() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [comentarios, setComentarios] = useState([]);
    const token = localStorage.getItem('token');

    const fetchComentarios = async () => {
        try {
            const response = await fetch(`http://18.228.8.220:8000/api/postagem/${state.id}/comentarios/`, {
                headers: {
                    accept: 'application/json',
                    Authorization: `Token ${token}`,
                },
            });
            const data = await response.json();
            setComentarios(data);
        } catch (error) {
            console.error('Erro ao buscar os comentários:', error);
        }
    };

    useEffect(() => {
        if (state?.id) {
            fetchComentarios();
        }
    }, [state]);

    if (!state) {
        return <div>Dados não encontrados</div>;
    }

    const {
        nome,
        status,
        imagem,
        fotoPerfil,
        nomePerfil,
        data,
        hora,
        votos,
        descricao,
        natureza,
    } = state;

    const statusMap = {
        "1": "pendente",
        "2": "resolvido",
        "3": "falso",
    };

    const naturezaMap = {
        "1": "infraestrutura",
        "2": "iluminação",
        "3": "coleta de lixo",
        "4": "saneamento",
        "5": "trânsito",
        "6": "outro",
    };

    const statusConvertido = statusMap[status] || "não especificado";
    const naturezaConvertida = naturezaMap[natureza] || "não especificado";

    return (
        <div className='relative flex flex-col h-screen w-screen bg-[#e9e8e8] overflow-auto'>
            <div className='fixed top-0 flex items-center bg-white w-screen min-h-12 text-xl font-semibold shadow-inner gap-2'>
                <PiArrowLeftBold className='ml-2' onClick={() => navigate('/home')} size={20} />
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
                            src={`http://18.228.8.220:8000${imagem}`}
                            className='w-full h-full rounded-t-lg'
                        />
                    </div>
                    <div className='flex justify-between items-center rounded-b-lg bg-white p-1'>
                        <div className='px-3 flex flex-col font-semibold'>
                            <p className='leading-4 my-2'>{descricao}</p>
                            <h1 className='flex'>Votos: <p className='font-normal ml-1'>{votos} votos</p></h1>
                            <h1 className='flex'>Natureza: <p className='font-normal ml-1 mb-3'>{naturezaConvertida}.</p></h1>
                        </div>
                    </div>
                </div>
                <h1 className='text-lg font-semibold mt-4'>Comentários</h1>
                <div className='flex overflow-auto gap-2'>
                    {comentarios.map((comentario) => (
                        <div className='h-full w-full mb-3'>
                            <Comentario
                                key={comentario.id}
                                texto={comentario.texto}
                                usuario={comentario.usuario}
                            />
                        </div>
                    ))}
                </div>
                <h1 className='text-lg font-semibold mt-2'>Comentários</h1>
                <div className='flex gap-2 mt-1'>
                    <button className='botao-estilo-1'>
                        Comentar
                    </button>
                    <button className='botao-estilo-2'>
                        Avaliar
                    </button>
                </div>
                <h1 className='text-lg font-semibold mt-4 mb-20'>Atividades Recentes</h1>
            </div>
        </div>
    );
}

export default Detalhes;