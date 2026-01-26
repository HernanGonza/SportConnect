// src/components/CanchasView.jsx
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Space, Card, Switch, InputNumber, message } from 'antd';
import CrearCanchaModal from './CrearCanchaModal';
import EditarCanchaModal from './EditarCanchaModal';
import CanchaCard from './CanchaCard';
import supabase from '../services/supabaseClient';
import { eliminarCancha } from '../services/authService';
import styles from './CanchasView.module.css';

export default function CanchasView({ clubId }) {
  const [canchas, setCanchas] = useState([]);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [canchaEditar, setCanchaEditar] = useState(null);
  const [preciosDinamicosGlobal, setPreciosDinamicosGlobal] = useState(true);
  const [minPrecio, setMinPrecio] = useState(16000);
  const [maxPrecio, setMaxPrecio] = useState(22000);
  const [precioBaseGlobal, setPrecioBaseGlobal] = useState(20000);

  const cargarCanchas = useCallback(async () => {
    const { data, error } = await supabase
      .from('canchas')
      .select('id, nombre, tipo, estado, club_id')
      .eq('club_id', clubId);

    if (error) {
      message.error('Error cargando canchas');
      console.error(error);
    } else {
      setCanchas(data || []);
    }
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      cargarCanchas();
    }

    const subscription = supabase
      .channel('canchas-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'canchas', filter: `club_id=eq.${clubId}` },
        () => cargarCanchas()
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [clubId, cargarCanchas]);

  const handleSuccess = () => {
    cargarCanchas();
  };

  const handleEditar = (cancha) => {
    setCanchaEditar(cancha);
    setModalEditarVisible(true);
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarCancha(id);
      message.success('Cancha eliminada');
      handleSuccess();
    } catch (err) {
      message.error(err.message || 'Error al eliminar cancha');
    }
  };

  const handleAgregarConsumo = (cancha) => {
    message.info(`Agregar consumo a ${cancha.nombre} - Próximamente`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gestión de canchas</h2>
        <Button type="primary" onClick={() => setModalCrearVisible(true)}>
          Crear cancha
        </Button>
      </div>

      <Card className={styles.globalCard}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <Switch 
              checked={preciosDinamicosGlobal} 
              onChange={setPreciosDinamicosGlobal} 
            />
            <span>Precios Dinámicos Global {preciosDinamicosGlobal ? 'Activado' : 'Desactivado'}</span>
          </Space>
          <Space>
            <span>Precio base global:</span>
            <InputNumber 
              min={1000} 
              step={1000} 
              value={precioBaseGlobal} 
              onChange={setPrecioBaseGlobal} 
            />
          </Space>
          <Space>
            <span>Tope mínimo:</span>
            <InputNumber 
              min={1000} 
              max={precioBaseGlobal - 1000} 
              step={1000} 
              value={minPrecio} 
              onChange={setMinPrecio} 
            />
          </Space>
          <Space>
            <span>Tope máximo:</span>
            <InputNumber 
              min={precioBaseGlobal + 1000} 
              step={1000} 
              value={maxPrecio} 
              onChange={setMaxPrecio} 
            />
          </Space>
        </Space>
      </Card>

      <Space wrap size={16} style={{ marginTop: 24 }}>
        {[...canchas]
          .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { numeric: true }))
          .map((cancha) => (
            <CanchaCard
              key={cancha.id}
              cancha={cancha}
              preciosDinamicosGlobal={preciosDinamicosGlobal}
              minPrecio={minPrecio}
              maxPrecio={maxPrecio}
              precioBaseGlobal={precioBaseGlobal}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
              onAgregarConsumo={handleAgregarConsumo}
            />
          ))}
      </Space>

      <CrearCanchaModal
        visible={modalCrearVisible}
        onCancel={() => setModalCrearVisible(false)}
        onSuccess={handleSuccess}
      />

      <EditarCanchaModal
        visible={modalEditarVisible}
        onCancel={() => setModalEditarVisible(false)}
        cancha={canchaEditar}
        onSuccess={handleSuccess}
      />
    </div>
  );
}