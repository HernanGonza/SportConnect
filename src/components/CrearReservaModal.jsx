// src/components/CrearReservaModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, DatePicker, TimePicker, InputNumber, message } from 'antd';
import { crearReservaManual, getJugadores } from '../services/authService';
import supabase from '../services/supabaseClient';

const { Option } = Select;

export default function CrearReservaModal({ visible, onCancel, onSuccess, clubId }) {
  const [canchas, setCanchas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [precioCalculado, setPrecioCalculado] = useState(null);
  const [formData, setFormData] = useState({
    canchaId: null,
    usuarioId: null,
    fecha: null,
    hora_inicio: null,
    hora_fin: null,
    precio_total: null,
    estado_pago: 'pendiente',
  });

  // Parámetros del algoritmo (deberían venir de config global, pero por ahora hardcodeados)
  const NORMALIZADOR = 0.6;
  const SUAVIZADO = 0.3;
  const DEMANDA_PROMEDIO = 8;

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: c } = await supabase
        .from('canchas')
        .select('id, nombre')
        .eq('club_id', clubId);

      let u = [];
      try {
        u = await getJugadores();
      } catch (err) {
        message.error('No se pudieron cargar los jugadores');
      }

      setCanchas(c || []);
      setUsuarios(u || []);
    };

    if (visible && clubId) {
      cargarDatos();
    }
  }, [visible, clubId]);

  // Calcular precio cuando cambia la cancha
  useEffect(() => {
    const calcularPrecioCancha = async () => {
      if (!formData.canchaId) {
        setPrecioCalculado(null);
        setFormData(prev => ({ ...prev, precio_total: null }));
        return;
      }

      // Aquí reutilizamos la lógica de PreciosDinamicos (simplificada)
      // En producción, podrías tener una edge function que devuelva el precio actual
      const horaActual = new Date().getHours();
      let factorHorario = 1.0;
      if (horaActual >= 18 && horaActual <= 22) factorHorario = 1.3;
      else if (horaActual < 8 || horaActual > 23) factorHorario = 0.7;

      // Simulamos demanda (en real, consulta reservas como en PreciosDinamicos)
      const demandaSimulada = 8; // reemplazar por consulta real si querés precisión

      const R = demandaSimulada / DEMANDA_PROMEDIO;
      const Mcrudo = 1 + (R - 1) * NORMALIZADOR;
      const Mlimitado = Math.min(Math.max(Mcrudo, 0.7), 2.0); // min/max del config global
      const precioBase = 20000; // tomar del config global cuando lo tengas
      const nuevoPrecio = Math.round(precioBase * Mlimitado * factorHorario / 100) * 100;

      setPrecioCalculado(nuevoPrecio);
      setFormData(prev => ({ ...prev, precio_total: nuevoPrecio }));
    };

    calcularPrecioCancha();
  }, [formData.canchaId]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCrear = async () => {
    if (!formData.canchaId || !formData.usuarioId || !formData.fecha || !formData.hora_inicio || !formData.hora_fin || !formData.precio_total) {
      message.error('Completa todos los campos obligatorios');
      return;
    }

    try {
      await crearReservaManual(
        formData.canchaId,
        formData.usuarioId,
        formData.fecha.format('YYYY-MM-DD'),
        formData.hora_inicio.format('HH:mm'),
        formData.hora_fin.format('HH:mm'),
        formData.precio_total,
        formData.estado_pago
      );
      message.success('Reserva creada correctamente');
      onSuccess();
      onCancel();
    } catch (err) {
      message.error(err.message || 'Error al crear la reserva');
    }
  };

  const formatARS = (num) => num ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(num) : '';

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      title="Crear reserva manual"
      width={600}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <label>Cancha</label>
          <Select
            placeholder="Selecciona una cancha"
            style={{ width: '100%' }}
            onChange={v => handleChange('canchaId', v)}
          >
            {canchas.map(c => (
              <Option key={c.id} value={c.id}>
                {c.nombre}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label>Jugador</label>
          <Select
            placeholder="Busca un jugador"
            style={{ width: '100%' }}
            onChange={v => handleChange('usuarioId', v)}
            showSearch
            optionFilterProp="children"
          >
            {usuarios.map(u => (
              <Option key={u.id} value={u.id}>
                {u.nombre} {u.apellido}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label>Fecha</label>
          <DatePicker
            style={{ width: '100%' }}
            onChange={v => handleChange('fecha', v)}
            placeholder="Selecciona fecha"
          />
        </div>

        <div>
          <label>Hora inicio</label>
          <TimePicker
            style={{ width: '100%' }}
            format="HH:mm"
            minuteStep={60}
            onChange={v => handleChange('hora_inicio', v)}
            placeholder="Hora inicio"
          />
        </div>

        <div>
          <label>Hora fin</label>
          <TimePicker
            style={{ width: '100%' }}
            format="HH:mm"
            minuteStep={60}
            onChange={v => handleChange('hora_fin', v)}
            placeholder="Hora fin"
          />
        </div>

        <div>
          <label>Precio total</label>
          <InputNumber
            style={{ width: '100%' }}
            value={precioCalculado}
            disabled // ← read-only
            formatter={value => formatARS(value)}
          />
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            Precio calculado automáticamente según configuración actual
          </div>
        </div>

        <div>
          <label>Estado de pago</label>
          <Select
            style={{ width: '100%' }}
            value={formData.estado_pago}
            onChange={v => handleChange('estado_pago', v)}
          >
            <Option value="pendiente">Pendiente</Option>
            <Option value="seña">Seña</Option>
            <Option value="pagado">Pagado</Option>
          </Select>
        </div>

        <Button type="primary" onClick={handleCrear} block disabled={!precioCalculado}>
          Crear reserva
        </Button>
      </div>
    </Modal>
  );
}