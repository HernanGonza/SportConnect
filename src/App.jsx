// src/App.jsx - Versión limpia sin theme toggle
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import ComplejoDetalle from './pages/ComplejoDetalle';
import Reservar from './pages/Reservar';
import MisReservas from './pages/MisReservas';
import RegistroDinamico from './pages/RegistroDinamico';
import PanelUsuario from './pages/PanelUsuario';
import PanelClub from './pages/PanelClub';
import PanelEmpleado from './pages/PanelEmpleado';
import AuthCallback from './pages/AuthCallback';
import SeleccionTipoRegistro from './pages/SeleccionTipoRegistro';
import RegistroDinamicoClub from './pages/RegistroDinamicoClub';
import PerfilUsuario from './pages/PerfilUsuario';

const { Content, Footer: AntFooter } = Layout;

function useIsHome() {
  const location = useLocation();
  return [
    '/',
    '/registro/seleccion',
    '/registro/jugador',
    '/registro/club',
    '/auth/callback'
  ].includes(location.pathname);
}

function AppLayout({ children }) {
  const isHome = useIsHome();

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isHome && <Header />}
      <Content style={{ flex: 1, marginTop: isHome ? 0 : 64 }}>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
        <Route path="/registro/seleccion" element={<AppLayout><SeleccionTipoRegistro /></AppLayout>} />
        <Route path="/registro/jugador" element={<AppLayout><RegistroDinamico /></AppLayout>} />
        <Route path="/registro/club" element={<AppLayout><RegistroDinamicoClub /></AppLayout>} />
        
        {/* Rutas de Panel (sin Layout global para tener control total del diseño) */}
        <Route path="/panel-usuario" element={<PanelUsuario />} />
        <Route path="/panel-club/*" element={<PanelClub />} />
        <Route path="/panel-empleado" element={<PanelEmpleado />} />
        
        <Route path="/auth/callback" element={<AppLayout><AuthCallback /></AppLayout>} />
        <Route path="/complejo/:id" element={<AppLayout><ComplejoDetalle /></AppLayout>} />
        <Route path="/reservar/:canchaId" element={<AppLayout><Reservar /></AppLayout>} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
      </Routes>
    </Router>
  );
}

export default App;