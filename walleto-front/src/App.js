import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Vaults from './pages/Vault';
import Header from './components/molecules/Header';
import MainPanel from './pages/MainPanel'
import Transactions from './pages/Transaction'
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <div className='content'>
          <Routes>
          <Route path="/" element={<MainPanel />} />
            <Route path="/manage-vaults" element={<Vaults />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
