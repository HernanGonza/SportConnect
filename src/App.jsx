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
import 'antd/dist/reset.css';
import RegistroDinamico from './pages/RegistroDinamico';
import PanelUsuario from './pages/PanelUsuario';
import PanelClub from './pages/PanelClub';
import PanelEmpleado from './pages/PanelEmpleado';
import AuthCallback from './pages/AuthCallback';
import SeleccionTipoRegistro from './pages/SeleccionTipoRegistro';
import RegistroDinamicoClub from './pages/RegistroDinamicoClub';

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
      <AntFooter style={{ width: '100%', padding: '24px 50px', textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.65)' }}>
        <Footer />
      </AntFooter>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
        <Route path="/registro/seleccion" element={<AppLayout><SeleccionTipoRegistro /></AppLayout>} />
        <Route path="/registro/jugador" element={<AppLayout><RegistroDinamico /></AppLayout>} />
        <Route path="/registro/club" element={<AppLayout><RegistroDinamicoClub /></AppLayout>} />
        <Route path="/panel-usuario" element={<AppLayout><PanelUsuario /></AppLayout>} />
        <Route path="/panel-club/*" element={<AppLayout><PanelClub /></AppLayout>} />
        <Route path="/panel-empleado" element={<AppLayout><PanelEmpleado /></AppLayout>} />
        <Route path="/auth/callback" element={<AppLayout><AuthCallback /></AppLayout>} />
        <Route path="/complejo/:id" element={<AppLayout><ComplejoDetalle /></AppLayout>} />
        <Route path="/reservar/:canchaId" element={<AppLayout><Reservar /></AppLayout>} />
        <Route path="/mis-reservas" element={<AppLayout><MisReservas /></AppLayout>} />
      </Routes>
    </Router>
  );
}

export default App;