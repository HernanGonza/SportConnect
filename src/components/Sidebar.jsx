// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { cerrarSesion } from '../services/authService';
import styles from './Sidebar.module.css';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = ({ userType = 'jugador', userName = 'Usuario', userPhoto }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await cerrarSesion();
    navigate('/');
  };

  const menuItems = {
    jugador: [
      { key: 'home', icon: <HomeOutlined />, label: <Link to="/panel">Inicio</Link> },
      { key: 'reservas', icon: <CalendarOutlined />, label: <Link to="/mis-reservas">Mis Reservas</Link> },
      { key: 'perfil', icon: <UserOutlined />, label: <Link to="/perfil">Mi Perfil</Link> },
    ],
    club: [
      { key: 'dashboard', icon: <HomeOutlined />, label: <Link to="/panel-club">Dashboard</Link> },
      { key: 'empleados', icon: <TeamOutlined />, label: <Link to="/panel-club/empleados">Empleados</Link> },
      { key: 'canchas', icon: <TableOutlined />, label: <Link to="/panel-club/canchas">Canchas</Link> },
      { key: 'reservas', icon: <CalendarOutlined />, label: <Link to="/panel-club/reservas">Reservas</Link> },
      { key: 'ventas', icon: <DollarOutlined />, label: <Link to="/panel-club/ventas">Ventas del día</Link> },
      { key: 'stock', icon: <ShoppingCartOutlined />, label: <Link to="/panel-club/stock">Stock / Tienda</Link> },
      { key: 'promociones', icon: <GiftOutlined />, label: <Link to="/panel-club/promociones">Promociones</Link> },
      { key: 'config', icon: <SettingOutlined />, label: <Link to="/panel-club/configuracion">Configuración</Link> },
    ],
    empleado: [
      { key: 'reservas', icon: <CalendarOutlined />, label: <Link to="/panel-empleado/reservas">Reservas</Link> },
      { key: 'caja', icon: <DollarOutlined />, label: <Link to="/panel-empleado/caja">Caja</Link> },
      { key: 'stock', icon: <ShoppingCartOutlined />, label: <Link to="/panel-empleado/stock">Stock</Link> },
    ],
  };

  const items = menuItems[userType] || menuItems.jugador;

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={280}
      collapsedWidth={80}
      className={styles.sider}
      breakpoint="lg"
      onBreakpoint={(broken) => {
        if (broken) setCollapsed(true);
      }}
    >
      {/* Botón hamburguesa arriba */}
      <div className={styles.logo}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className={styles.collapseBtn}
        />
        {!collapsed && <span className={styles.logoText}>Padel Club</span>}
      </div>

      {/* Perfil del usuario */}
      <div className={styles.profile}>
        <Avatar
          size={collapsed ? 40 : 64}
          src={userPhoto}
          icon={<UserOutlined />}
          className={styles.avatar}
        />
        {!collapsed && (
          <div className={styles.profileInfo}>
            <Text strong className={styles.userName}>
              {userName}
            </Text>
            <Text type="secondary" className={styles.userRole}>
              {userType === 'club' ? 'Dueño de Club' : userType === 'empleado' ? 'Empleado' : 'Jugador'}
            </Text>
          </div>
        )}
      </div>

      {/* Menú principal */}
      <Menu
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        items={items}
        className={styles.menu}
      />

      {/* Logout abajo */}
      <div className={styles.logout}>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          block
          className={styles.logoutBtn}
        >
          {!collapsed && 'Cerrar sesión'}
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;