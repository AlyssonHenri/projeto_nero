import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './index.css'

import Login from './root/paginas/login'
import Cadastro from './root/paginas/cadastro'
import Homepage from './root/paginas/homepage'
import Postagem from './root/paginas/postagem_detalhes'
import NovaPostagem from './root/paginas/nova_postagem'
import Mapa from './root/paginas/mapa'
import Perfil from './root/paginas/perfil'
import Corra from './root/paginas/corra'
import IsolarRota from './root/util/isolar_rota'

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route 
          path="/home" 
          element={
            <IsolarRota>
              <Homepage />
            </IsolarRota>
          }
        />
        <Route 
          path="/post/:id" 
          element={
            <IsolarRota>
              <Postagem />
            </IsolarRota>
          }
        />
        <Route 
          path="/post/novo" 
          element={
            <IsolarRota>
              <NovaPostagem />
            </IsolarRota>
          }
        />
        <Route 
          path="/mapa" 
          element={
            <IsolarRota>
              <Mapa />
            </IsolarRota>
          }
        />
        <Route 
          path="/perfil" 
          element={
            <IsolarRota>
              <Perfil />
            </IsolarRota>
          }
        />
        <Route 
          path="/saia/fuja/imediatamente" 
          element={
            <IsolarRota>
              <Corra />
            </IsolarRota>
          }
        />
      </Routes>
    </main>
  )
}

export default App