import React, { useState, useEffect } from 'react'
import { isBrowser } from 'react-device-detect'
import NavBar from '../componentes/nav_bar'
import { useNavigate } from 'react-router-dom'
import { RiArrowLeftSLine } from 'react-icons/ri'
import Divider from '@mui/material/Divider'

function Perfil() {
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('id')
    const navigate = useNavigate()

    const [erro, setErro] = useState('')
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        email: '',
        sexo: '',
        cpf: '',
        grau_ensino: '',
        data_nascimento: '',
        profile_image: '/images/sem-imagem.png',
    })
    const [postagens, setPostagens] = useState([])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
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
                setFormData((prev) => ({
                    ...prev,
                    username: data.username || '',
                    first_name: data.first_name || '',
                    email: data.email || '',
                    sexo: data.sexo || '',
                    cpf: data.cpf || '',
                    grau_ensino: data.grau_ensino || '',
                    data_nascimento: data.data_nascimento || '',
                    profile_image: data.profile_image || '/images/sem-imagem.png',
                }))
            } catch (error) {
                setErro(error.message)
            }
        }

        fetchUserData()
    }, [id, token])

    useEffect(() => {
        const fetchPostagens = async () => {
            try {
                const response = await fetch('https://api.nero.lat/api/postagem/', {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error('Erro ao buscar as postagens')
                }

                const data = await response.json()
                setPostagens(data)
            } catch (error) {
                setErro(error.message)
            }
        }

        fetchPostagens()
    }, [token])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleEditProfile = async () => {
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('first_name', formData.first_name);
            formDataToSubmit.append('email', formData.email);
            formDataToSubmit.append('cpf', formData.cpf);
            formDataToSubmit.append('data_nascimento', formData.data_nascimento);
            formDataToSubmit.append('sexo', formData.sexo);
            formDataToSubmit.append('grau_ensino', formData.grau_ensino);
    
            const response = await fetch(`https://api.nero.lat/api/usuario/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'X-CSRFTOKEN': 'WIrpmUtsL0kWEV7eSQTg2gzLKPlqjFNOo3DgSKpMW9XuYLGTLUtIXx00m1JZTKrN',
                },
                body: formDataToSubmit,
            });
    
            if (!response.ok) {
                throw new Error('Erro ao editar o perfil. Verifique os dados e tente novamente.');
            }
    
            const updatedData = await response.json();
            setFormData((prev) => ({
                ...prev,
                ...updatedData,
            }));
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            setErro(error.message);
            alert(`Erro ao atualizar perfil: ${error.message}`);
        }
    }

    const graudeEnsino = [
        { id: '7', text: 'Ensino Médio' },
        { id: '5', text: 'Ensino Fundamental' },
        { id: '9', text: 'Educação Superior' },
        { id: '8', text: 'Educação Superior Incompleta' },
        { id: '13', text: 'Doutorado' },
        { id: '12', text: 'Mestrado' },
        { id: '6', text: 'Ensino Médio Incompleto' },
        { id: '11', text: 'Pós-Graduação' },
        { id: '10', text: 'Pós-Graduação Incompleta' },
        { id: '4', text: '6º ao 9º Ano Fundamental Incompleto' },
        { id: '3', text: '5º Ano Fundamental' },
        { id: '2', text: 'Até o 5º Ano Fundamental Incompleto' },
        { id: '1', text: 'Analfabeto' },
    ]

    if (isBrowser) {
        return (
            <div className='flex flex-col items-center justify-center h-screen w-screen'>
                Acesso indisponível, tente novamente em um celular
            </div>
        )
    }

    return (
        <div className='relative h-full min-h-screen w-screen bg-[#e9e8e8]'>
            <div className='fixed top-0 flex items-center bg-white w-screen min-h-12 text-xl font-semibold shadow-inner gap-2'>
                <RiArrowLeftSLine className='ml-2' onClick={() => navigate(-1)} size={30} />
                <h1 className="font-semibold text-xl -mt-[1px]">Meu Perfil</h1>
            </div>
            <div className='bottom-0 start-0 fixed z-50'>
                <NavBar />
            </div>
            <div className='flex flex-row items-center justify-start ml-3 mt-12 py-1 -mb-3'>
                <img
                    src={formData.profile_image}
                    alt='Imagem de perfil'
                    className='h-14 w-14 object-cover'
                />
                <h1>{formData.username}</h1>
            </div>
            <div className="flex flex-col h-screen w-[95%] ml-3">
                <form>
                    <div className="mt-2">
                        <h1 className="font-semibold flex">Nome Completo</h1>
                        <input
                            type="text"
                            name="first_name"
                            className="input-generico w-full"
                            placeholder="Digite seu nome completo"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <h1 className="font-semibold flex">Email</h1>
                        <input
                            type="email"
                            name="email"
                            className="input-generico w-full"
                            placeholder="Digite seu endereço de email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <h1 className="font-semibold">CPF</h1>
                        <input
                            type="text"
                            name="cpf"
                            className="input-generico w-full"
                            placeholder="Digite seu CPF"
                            value={formData.cpf}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <h1 className="font-semibold">Data de Nascimento</h1>
                        <input
                            type="date"
                            name="data_nascimento"
                            className="input-generico w-full"
                            value={formData.data_nascimento}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <h1 className="font-semibold">Sexo</h1>
                        <input
                            type="text"
                            name="sexo"
                            className="input-generico w-full"
                            value={formData.sexo}
                            onChange={handleChange}
                        />
                    </div>
                </form>
                <div>
                    <h1 className="font-semibold">Grau de Ensino</h1>
                    <div className="flex overflow-auto gap-2">
                        {graudeEnsino.map((item) => (
                            <button
                                key={item.id}
                                className={`botao-estilo-5 mb-2 ${
                                    formData.grau_ensino === item.id ? 'bg-gray-300' : 'bg-[#F4F4F4]'
                                }`}
                                onClick={() => setFormData((prev) => ({ ...prev, grau_ensino: item.id }))}
                            >
                                {item.text}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-around gap-2 mt-4 w-full">
                    <button className="botao-estilo-2" onClick={handleEditProfile}>
                        Editar Perfil
                    </button>
                </div>
                <h1 className='font-semibold text-xl mb-3 mt-2'>Minhas Postagens</h1>
                {postagens.map((postagem, index) => (
                    <React.Fragment key={postagem.id}>
                        <div className='flex flex-row justify-between h-11'>
                            <div className='flex start-0'>
                                <div className={`mt-2 mr-2 rounded-full h-6 w-6 bg-gray-500}`}>
                                    <h1 className='ml-[1px]'>{postagem.status === 'pendente' ? '🔴' : '🟢'}</h1>
                                </div>
                                <div className='flex flex-col'>
                                    <h1 className='text-sm font-semibold'>{postagem.titulo}</h1>
                                    <h1 className='text-xs text-gray-500'>Enviado em {new Date(postagem.criacao).toLocaleDateString()}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='font-semibold mr-2 mt-2'>Status: {`${postagem.status === 1 ? 'pendente' : 'resolvido'}`}</h1>
                            </div>
                        </div>
                        {index < postagens.length - 0 && <Divider />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default Perfil
