import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Vaults from './components/Vault';
import Header from './components/Header';
import MainPanel from './components/MainPanel'
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <div className='content'>
          <Routes>
          <Route path="/" element={<MainPanel />} />
            <Route path="/manage-vaults" element={<Vaults />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
