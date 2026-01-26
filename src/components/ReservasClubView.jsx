// src/components/ReservasClubView.jsx
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Button, Space, Tabs, message } from 'antd';
import dayjs from 'dayjs';
import supabase from '../services/supabaseClient';
import CrearReservaModal from './CrearReservaModal';
import styles from './ReservasClubView.module.css';

const { TabPane } = Tabs;

export default function ReservasClubView({ clubId }) {
  const [reservasHoy, setReservasHoy] = useState([]);
  const [reservasFuturas, setReservasFuturas] = useState([]);
  const [reservasPasadas, setReservasPasadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCrearVisible, setModalCrearVisible] = useState(false); // ← agregado

  const cargarReservas = useCallback(async () => {
    const hoy = dayjs().format('YYYY-MM-DD');

    const { data: todas, error } = await supabase
      .from('reservas')
      .select(`
        id,
        fecha,
        hora_inicio,
        hora_fin,
        precio_total,
        estado_pago,
        usuarios (nombre, apellido),
        canchas (nombre)
      `)
      .eq('club_id', clubId);

    if (error) {
      message.error('Error cargando reservas');
      console.error(error);
      setLoading(false);
      return;
    }

    const hoyList = todas.filter(r => r.fecha === hoy);
    const futuras = todas.filter(r => r.fecha > hoy);
    const pasadas = todas.filter(r => r.fecha < hoy);

    setReservasHoy(hoyList);
    setReservasFuturas(futuras);
    setReservasPasadas(pasadas);
    setLoading(false);
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      setLoading(true);
      cargarReservas();
    }
  }, [clubId, cargarReservas]);

  const columns = [
    { 
      title: 'Fecha', 
      dataIndex: 'fecha', 
      key: 'fecha', 
      render: (f) => dayjs(f).format('DD/MM/YYYY'),
      sorter: (a, b) => dayjs(a.fecha).unix() - dayjs(b.fecha).unix(),
    },
    { 
      title: 'Hora', 
      key: 'hora', 
      render: (_, r) => `${r.hora_inicio} - ${r.hora_fin}` 
    },
    { title: 'Cancha', dataIndex: ['canchas', 'nombre'], key: 'cancha' },
    { 
      title: 'Jugador', 
      key: 'jugador', 
      render: (_, r) => `${r.usuarios.nombre} ${r.usuarios.apellido}` 
    },
    { 
      title: 'Total', 
      dataIndex: 'precio_total', 
      key: 'total', 
      render: (p) => `$${p}` 
    },
    { 
      title: 'Pago', 
      dataIndex: 'estado_pago', 
      key: 'pago', 
      render: (estado) => {
        const colors = { pagado: 'green', seña: 'orange', pendiente: 'red' };
        return <Tag color={colors[estado] || 'default'}>{estado.toUpperCase()}</Tag>;
      }
    },
    { 
      title: 'Acciones', 
      key: 'acciones', 
      render: () => (
        <Space>
          <Button type="link">Ver cuenta</Button>
          <Button type="link">Notificar</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={() => setModalCrearVisible(true)}>
          Crear reserva manual
        </Button>
      </div>

      <h2 className={styles.title}>Reservas del Club</h2>
      <Tabs defaultActiveKey="hoy" className={styles.tabs} items={[
  {
    key: 'hoy',
    label: `Hoy (${reservasHoy.length})`,
    children: (
      <Table 
        dataSource={reservasHoy} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        className={styles.table}
      />
    ),
  },
  {
    key: 'futuras',
    label: `Futuras (${reservasFuturas.length})`,
    children: (
      <Table 
        dataSource={reservasFuturas} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        className={styles.table}
      />
    ),
  },
  {
    key: 'pasadas',
    label: `Pasadas (${reservasPasadas.length})`,
    children: (
      <Table 
        dataSource={reservasPasadas} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        className={styles.table}
      />
    ),
  },
]} />

      <CrearReservaModal
        visible={modalCrearVisible}
        onCancel={() => setModalCrearVisible(false)}
        onSuccess={cargarReservas}
        clubId={clubId}
      />
    </div>
  );
}