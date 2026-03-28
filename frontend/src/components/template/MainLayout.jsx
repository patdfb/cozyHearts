// src/components/template/MainLayout.jsx
import React from 'react';
import Header from '../organisms/Header'; // Importa o Header aqui para garantir que ele fica fora do padding
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content-wrapper">
        {children}
      </main>

      <footer className="main-footer">
        Copyright Cozy Hearts 2026
      </footer>
    </div>
  );
};

export default MainLayout;