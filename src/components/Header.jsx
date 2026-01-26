// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Space, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../services/supabaseClient';
import { UserOutlined } from '@ant-design/icons';
import styles from './Header.module.css';

const { Header: AntHeader } = Layout;

export default function Header() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cargarPerfil = async (userId) => {
    const { data } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, foto_perfil_url, tipo')
      .eq('id', userId)
      .maybeSingle();

    setUsuario(data);
    setLoading(false);
  };

  useEffect(() => {
    const cargarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        cargarPerfil(session.user.id);
      } else {
        setUsuario(null);
        setLoading(false);
      }
    };

    cargarSesion();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        cargarPerfil(session.user.id);
      } else {
        setUsuario(null);
      }
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    navigate('/');
    message.success('Sesión cerrada');
  };

  if (loading) return <AntHeader className={styles.header}>Cargando...</AntHeader>;

  const nombreMostrar = usuario?.tipo === 'club' 
    ? usuario.nombre 
    : `${usuario?.nombre || ''} ${usuario?.apellido || ''}`.trim() || 'Usuario';

  // Ruta del logo según tipo
  const logoLink = usuario ? (usuario.tipo === 'club' ? '/panel-club' : '/panel') : '/';

  return (
    <AntHeader className={styles.header}>
      <div>
        <Link to={logoLink} className={styles.logoLink}>
          Padel Club Misiones
        </Link>
      </div>

      {usuario ? (
        <Space size="middle" className={styles.userActions}>
          <Avatar
            src={usuario.foto_perfil_url}
            icon={<UserOutlined />}
            size="large"
          >
            {!usuario.foto_perfil_url && nombreMostrar[0]?.toUpperCase()}
          </Avatar>

          <span>Hola, {nombreMostrar}</span>

          <Button type="primary" danger onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Space>
      ) : (
        <Menu
          theme="dark"
          mode="horizontal"
          items={[
            { key: 'login', label: <Link to="/login">Iniciar sesión</Link> },
            { key: 'registro', label: <Link to="/registro/seleccion">Registrarse</Link> },
          ]}
          className={styles.menu}
        />
      )}
    </AntHeader>
  );
}