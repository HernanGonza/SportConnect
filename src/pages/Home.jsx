// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Anchor, Steps, Popover, Spin, Button, Card, Row, Col } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import supabase from '../services/supabaseClient';
import {
  UserOutlined,
  CalendarOutlined,
  TableOutlined,
  CreditCardOutlined,
  SmileOutlined,
  TeamOutlined,
  ShopOutlined,
  DollarOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import styles from './Home.module.css';

export default function Home() {
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user && location.pathname === '/') {
        // Redirigir según tipo (jugador o club)
        const { data: perfil } = await supabase
          .from('usuarios')
          .select('tipo')
          .eq('id', user.id)
          .single();

        if (perfil?.tipo === 'club') {
          navigate('/panel-club', { replace: true });
        } else {
          navigate('/panel', { replace: true });
        }
        return;
      }

      setCheckingAuth(false);
    };

    const img = new Image();
    img.src = '/images/background.jpg';
    img.onload = img.onerror = () => setBackdropLoaded(true);

    checkAuth();
  }, [navigate, location]);

  if (checkingAuth) return <Spin spinning fullscreen />;

  const anchorItems = [
    { key: 'hero', href: '#hero', title: 'Inicio' },
    { key: 'about', href: '#about', title: 'Sobre Nosotros' },
    { key: 'features-players', href: '#features-players', title: 'Para Jugadores' },
    { key: 'features-clubs', href: '#features-clubs', title: 'Para Clubs' },
    { key: 'how', href: '#how', title: 'Cómo funciona' },
    { key: 'join', href: '#join', title: 'Únete' },
  ];

  const steps = [
    { title: 'Registrate', icon: <UserOutlined className={styles.stepIcon} /> },
    { title: 'Buscá cancha', icon: <CalendarOutlined className={styles.stepIcon} /> },
    { title: 'Elegí horario', icon: <TableOutlined className={styles.stepIcon} /> },
    { title: 'Reservá y pagá', icon: <CreditCardOutlined className={styles.stepIcon} /> },
    { title: '¡Jugá!', icon: <SmileOutlined className={styles.stepIcon} /> },
  ];

  return (
    <div className={styles.page}>
      {/* Anchor corregido: affix false + offsetTop para que marque activo al scroll */}
      <div className={styles.anchorContainer}>
        <Anchor
          items={anchorItems}
          affix={false}
          offsetTop={100}
          targetOffset={100}
        />
      </div>

      {/* Hero */}
      <section id="hero" className={styles.heroWrapper}>
        <div className={`${styles.heroBackdrop} ${backdropLoaded ? styles.loaded : ''}`}></div>
        <div className={styles.heroImage}></div>
        <div className={styles.heroContent}>
          <h1>Padel Club Misiones</h1>
          <p>La plataforma para jugadores y clubes de pádel en Misiones</p>
          <div className={styles.ctaButtons}>
            <Link to="/registro/seleccion" className={styles.primaryButton}>
              Registrarse
            </Link>
            <Link to="/login" className={styles.secondaryLink}>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre Nosotros */}
      <section id="about" className={styles.section}>
        <h2>Sobre Nosotros</h2>
        <p className={styles.sectionText}>
          Somos una plataforma creada por y para amantes del pádel en Misiones.
          Conectamos jugadores con clubes para hacer la reserva de canchas simple, rápida y segura.
        </p>
      </section>

      {/* Para Jugadores */}
      <section id="features-players" className={styles.section}>
        <h2>Para Jugadores</h2>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={8}>
            <Card hoverable>
              <UserOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <h3>Reservá fácil</h3>
              <p>Buscá canchas disponibles por fecha, horario y ubicación.</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <CalendarOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <h3>Mis reservas</h3>
              <p>Administrá todas tus reservas en un solo lugar.</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <TeamOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <h3>Unite a torneos</h3>
              <p>Participá en torneos organizados por los clubes.</p>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Para Clubs */}
      <section id="features-clubs" className={styles.section} style={{ background: '#f9f9ff' }}>
        <h2>Para Clubs</h2>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={8}>
            <Card hoverable>
              <ShopOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <h3>Gestioná tu club</h3>
              <p>Administra canchas, reservas, empleados y stock.</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <DollarOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <h3>Ventas y pagos</h3>
              <p>Controlá ingresos, ventas diarias y reportes.</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <GiftOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <h3>Promociones</h3>
              <p>Creá ofertas y promociones para atraer jugadores.</p>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Cómo funciona */}
      <section id="how" className={styles.section}>
        <h2>Cómo funciona</h2>
        <div className={styles.stepsContainer}>
          <Steps current={-1} items={steps} responsive />
        </div>
      </section>

      {/* Únete */}
      <section id="join" className={styles.section} style={{ background: '#001529', color: 'white' }}>
        <h2>¿Listo para jugar?</h2>
        <p className={styles.sectionText}>
          Únete a la comunidad de pádel más grande de Misiones
        </p>
        <div className={styles.joinButtonContainer}>
          <Link to="/registro/seleccion" className={styles.joinButton}>
            Crear cuenta gratis
          </Link>
        </div>
      </section>
    </div>
  );
}