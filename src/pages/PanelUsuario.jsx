// src/pages/PanelUsuario.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Typography, Divider, Button, Card, Table, Tag, message, Spin, Space } from 'antd';
import { UserOutlined, CalendarOutlined, BankOutlined, PhoneOutlined, IdcardOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import supabase from '../services/supabaseClient';
import styles from './PanelUsuario.module.css';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function PanelUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      const { data: perfil } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!perfil) {
        navigate('/login', { replace: true });
        return;
      }

      setUsuario(perfil);

      // Cargar próximas reservas (cuando exista la tabla reservas)
      const hoy = new Date().toISOString().split('T')[0];
      const { data: reservasData } = await supabase
        .from('reservas')
        .select(`
          id,
          fecha,
          hora_inicio,
          hora_fin,
          precio_total,
          canchas (
            nombre,
            complejos (nombre)
          )
        `)
        .eq('usuario_id', user.id)
        .gte('fecha', hoy)
        .order('fecha', { ascending: true })
        .limit(5);

      setReservas(reservasData || []);
      setLoading(false);
    };

    cargarDatos();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
    message.success('Sesión cerrada');
  };

  if (loading) return <Spin spinning fullscreen />;

  const datosPersonales = [
    { key: 'dni', icon: <IdcardOutlined />, label: 'DNI', value: usuario.dni },
    { key: 'direccion', icon: <BankOutlined />, label: 'Dirección', value: `${usuario.direccion}, ${usuario.localidad}, ${usuario.provincia}` },
    { key: 'telefono', icon: <PhoneOutlined />, label: 'Teléfono', value: usuario.telefono || 'No proporcionado' },
    { key: 'nacimiento', icon: <CalendarOutlined />, label: 'Fecha de nacimiento', value: usuario.fecha_nacimiento },
  ];

  const columnasDatos = [
    {
      title: 'Dato',
      dataIndex: 'label',
      key: 'label',
      render: (text, record) => (
        <Space>
          {record.icon}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Información',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const columnasReservas = [
    {
      title: 'Complejo - Cancha',
      key: 'lugar',
      render: (_, record) => (
        <Text strong>
          {record.canchas?.complejos?.nombre || 'Club'} - {record.canchas?.nombre || 'Cancha'}
        </Text>
      ),
    },
    {
      title: 'Fecha y hora',
      key: 'fecha',
      render: (_, record) => `${record.fecha} • ${record.hora_inicio} - ${record.hora_fin}`,
    },
    {
      title: 'Precio',
      dataIndex: 'precio_total',
      key: 'precio',
      render: (precio) => precio ? <Tag color="green">${precio}</Tag> : '-',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Sidebar
          userType="jugador"
          userName={`${usuario.nombre} ${usuario.apellido}`}
          userPhoto={usuario.foto_perfil_url}
          onCollapse={setCollapsed}
        />
        <Layout>
          <Content className={`${styles.content} ${collapsed ? styles.contentCollapsed : ''}`}>
            <div className={styles.innerContent}>
              <div className={styles.header}>
                <Avatar size={100} src={usuario.foto_perfil_url} icon={<UserOutlined />} className={styles.avatar} />
                <div className={styles.info}>
                  <Title level={1} style={{ margin: 0 }}>
                    {usuario.nombre} {usuario.apellido}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '1.1rem' }}>{usuario.email}</Text>
                  <div className={styles.badge}>
                    <TeamOutlined /> Categoría: {usuario.categoria}
                  </div>
                </div>
                <Button type="primary" danger size="large" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>

              <Divider />

              <Card title="Mis datos personales" className={styles.card}>
                <Table
                  dataSource={datosPersonales}
                  columns={columnasDatos}
                  pagination={false}
                  showHeader={false}
                  rowKey="key"
                />
              </Card>

              <Divider />

              <Card title="Próximas reservas" className={styles.card}>
                {reservas.length > 0 ? (
                  <Table
                    dataSource={reservas}
                    columns={columnasReservas}
                    pagination={false}
                    rowKey="id"
                  />
                ) : (
                  <Text type="secondary" style={{ fontSize: '1rem' }}>
                    No tenés reservas próximas. ¡Buscá una cancha y reservá tu turno!
                  </Text>
                )}
              </Card>

              <div className={styles.actions}>
                <Button type="default" size="large" onClick={() => navigate('/')}>
                  Buscar canchas
                </Button>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}