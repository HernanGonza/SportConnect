// src/pages/PanelClub.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Spin, Table, Button, message, Space, Popconfirm } from 'antd';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CrearEmpleadoModal from '../components/CrearEmpleadoModal';
import EditarEmpleadoModal from '../components/EditarEmpleadoModal';
import ProductosView from '../components/ProductosView';
import supabase from '../services/supabaseClient';
import { eliminarEmpleado } from '../services/authService';
import styles from './PanelClub.module.css';
import CanchasView from '../components/CanchasView';
import ReservasClubView from '../components/ReservasClubView';


const { Content } = Layout;

const DashboardView = ({ club }) => (
  <div style={{ padding: '24px' }}>
    <h1>Dashboard del Club</h1>
    <p>Bienvenido, {club?.nombre}.</p>
    <p>Próximamente: estadísticas, reservas del día, ingresos, etc.</p>
  </div>
);

const EmpleadosView = ({ clubId }) => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [empleadoEditar, setEmpleadoEditar] = useState(null);

  useEffect(() => {
    const cargarEmpleados = async () => {
      const { data, error } = await supabase
        .from('empleados_club')
        .select('*')
        .eq('club_id', clubId);

      if (error) {
        message.error('Error cargando empleados');
        console.error(error);
      } else {
        setEmpleados(data || []);
      }
      setLoading(false);
    };

    if (clubId) cargarEmpleados();
  }, [clubId]);

  const handleSuccess = async () => {
    const { data } = await supabase
      .from('empleados_club')
      .select('*')
      .eq('club_id', clubId);

    setEmpleados(data || []);
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarEmpleado(id);
      message.success('Empleado eliminado');
      handleSuccess();
    } catch (err) {
      message.error(err.message || 'Error al eliminar');
    }
  };

  const handleEditar = (empleado) => {
    setEmpleadoEditar(empleado);
    setModalEditarVisible(true);
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Rol', dataIndex: 'rol', key: 'rol', render: (rol) => rol.charAt(0).toUpperCase() + rol.slice(1) },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEditar(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Seguro que querés eliminar este empleado?"
            onConfirm={() => handleEliminar(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) return <Spin />;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Gestión de Empleados</h2>
        <Button type="primary" onClick={() => setModalCrearVisible(true)}>
          Crear empleado
        </Button>
      </div>

      <Table dataSource={empleados} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />

      <CrearEmpleadoModal
        visible={modalCrearVisible}
        onCancel={() => setModalCrearVisible(false)}
        clubId={clubId}
        onSuccess={handleSuccess}
      />

      <EditarEmpleadoModal
        visible={modalEditarVisible}
        onCancel={() => setModalEditarVisible(false)}
        empleado={empleadoEditar}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default function PanelClub() {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('clubes')
        .select('*')
        .eq('id', user.id);

      if (error || !data || data.length === 0) {
        console.error('Error cargando club:', error);
        setLoading(false);
        return;
      }

      setClub(data[0]);
      setLoading(false);
    };

    cargarDatos();
  }, []);

  if (loading) return <Spin spinning fullscreen />;

  if (!club) return <div>Error: No se encontró el club. Por favor, cierra sesión y vuelve a entrar.</div>;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Sidebar userType="club" userName={club.nombre} userPhoto={club.foto_url} onCollapse={setCollapsed} />
        <Layout>
          <Content className={`${styles.content} ${collapsed ? styles.contentCollapsed : ''}`}>
            <Routes>
              <Route path="/" element={<DashboardView club={club} />} />
              <Route path="/empleados" element={<EmpleadosView clubId={club.id} />} />
              <Route path="/stock" element={<ProductosView clubId={club.id} />} />
              <Route path="/canchas" element={<CanchasView clubId={club.id} />} />
              <Route path="/reservas" element={<ReservasClubView clubId={club.id} />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}