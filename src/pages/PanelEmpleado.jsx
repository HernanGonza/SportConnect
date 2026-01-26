// src/pages/PanelEmpleado.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Spin, message } from 'antd';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import supabase from '../services/supabaseClient';
import styles from './PanelClub.module.css';

const { Content } = Layout;

export default function PanelEmpleado() {
  const [club, setClub] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        message.error('No estás logueado');
        setLoading(false);
        return;
      }

      // Cargar empleado
      const { data: empData, error: empError } = await supabase
        .from('empleados_club')
        .select('*')
        .eq('user_id', user.id);

      if (empError || !empData || empData.length === 0) {
        message.error('No se encontró tu perfil de empleado. Contacta al dueño del club.');
        setLoading(false);
        return;
      }

      const empleadoActual = empData[0];
      setEmpleado(empleadoActual);

      // Cargar club
      const { data: clubData, error: clubError } = await supabase
        .from('clubes')
        .select('*')
        .eq('id', empleadoActual.club_id);

      if (clubError || !clubData || clubData.length === 0) {
        message.error('No se encontró el club asociado');
        setLoading(false);
        return;
      }

      setClub(clubData[0]);
      setLoading(false);
    };

    cargarDatos();
  }, []);

  if (loading) return <Spin spinning fullscreen />;

  if (!club || !empleado) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
        <h2>Error al cargar el panel del empleado</h2>
        <p>No se encontró tu perfil. Verificá con el dueño del club.</p>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Sidebar
          userType="empleado"
          userName={empleado.nombre}
          userPhoto={null}
          onCollapse={setCollapsed}
        />
        <Layout>
          <Content className={`${styles.content} ${collapsed ? styles.contentCollapsed : ''}`}>
            <div style={{ padding: '40px' }}>
              <h1>Bienvenido, {empleado.nombre}</h1>
              <h2>Club: {club.nombre}</h2>
              <p><strong>Rol:</strong> {empleado.rol.charAt(0).toUpperCase() + empleado.rol.slice(1)}</p>
              <p>Desde aquí puedes gestionar reservas, caja diaria, stock y más herramientas del club.</p>
              {/* Próximamente: módulos específicos para empleado */}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}