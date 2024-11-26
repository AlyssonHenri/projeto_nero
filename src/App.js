import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';

import Login from './root/paginas/login'
import Homepage from './root/paginas/homepage'
import Postagem from './root/paginas/postagem_detalhes'

function App() {
  return (
    <main>
      <Routes>
        {/* rota inicial */}
        <Route >
          <Route path='/' element={<Login />} />
        </Route>

        {/* rota validadas */}
        <Route>
          <Route path='/home' element={<Homepage/>}/>
          <Route path='/post/:id' element={<Postagem/>}/>
        </Route>

      </Routes>
    </main>
  );
}

export default App;