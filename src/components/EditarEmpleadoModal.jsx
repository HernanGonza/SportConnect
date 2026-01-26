// src/components/EditarEmpleadoModal.jsx
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, DatePicker, message, Space } from 'antd';
import { User, Phone, Home, MapPin, Calendar } from 'lucide-react'; // ← iconos animados
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/es_ES';
import { editarEmpleado } from '../services/authService';
import { PROVINCIAS_ARGENTINAS } from '../utils/provincias';
import styles from './CrearEmpleadoModal.module.css'; // reutiliza

const pasos = [
  'Nombre',
  'Apellido',
  'DNI',
  'Email',
  'Rol',
  'Teléfono (opcional)',
  'Dirección (opcional)',
  'Localidad (opcional)',
  'Provincia',
  'Fecha de nacimiento (opcional)',
];

export default function EditarEmpleadoModal({ visible, onCancel, empleado, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    rol: 'empleado',
    telefono: '',
    direccion: '',
    localidad: '',
    provincia: 'Misiones',
    fecha_nacimiento: null,
  });

  useEffect(() => {
    if (visible && empleado) {
      const [nombre = '', apellido = ''] = (empleado.nombre || '').split(' ');
      setFormData({
        nombre,
        apellido,
        dni: empleado.dni || '',
        email: empleado.email || '',
        rol: empleado.rol || 'empleado',
        telefono: empleado.telefono || '',
        direccion: empleado.direccion || '',
        localidad: empleado.localidad || '',
        provincia: empleado.provincia || 'Misiones',
        fecha_nacimiento: empleado.fecha_nacimiento ? dayjs(empleado.fecha_nacimiento) : null,
      });
      setCurrentStep(0);
    }
  }, [visible, empleado]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep === pasos.length - 1) {
      try {
        await editarEmpleado(
          empleado.id,
          formData.nombre,
          formData.apellido,
          formData.dni,
          formData.email,
          formData.rol,
          formData.telefono || null,
          formData.direccion || null,
          formData.localidad || null,
          formData.provincia,
          formData.fecha_nacimiento?.format('YYYY-MM-DD') || null
        );
        message.success('Empleado actualizado');
        onSuccess();
        onCancel();
      } catch (err) {
        message.error(err.message || 'Error al editar empleado');
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const renderCampo = () => {
    const paso = pasos[currentStep];
    switch (paso) {
      case 'Nombre':
        return <Input size="large" placeholder="Juan" value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} />;
      case 'Apellido':
        return <Input size="large" placeholder="Pérez" value={formData.apellido} onChange={e => handleChange('apellido', e.target.value)} />;
      case 'DNI':
        return <Input size="large" placeholder="12345678" value={formData.dni} onChange={e => handleChange('dni', e.target.value)} />;
      case 'Email':
        return <Input size="large" type="email" placeholder="empleado@club.com" value={formData.email} onChange={e => handleChange('email', e.target.value)} />;
      case 'Rol':
        return (
          <Select size="large" value={formData.rol} onChange={value => handleChange('rol', value)}>
            <Select.Option value="admin">Administrador</Select.Option>
            <Select.Option value="empleado">Empleado</Select.Option>
            <Select.Option value="cajero">Cajero</Select.Option>
          </Select>
        );
      case 'Teléfono (opcional)':
        return <Input size="large" placeholder="3764123456" value={formData.telefono} onChange={e => handleChange('telefono', e.target.value)} />;
      case 'Dirección (opcional)':
        return <Input size="large" placeholder="Calle 123" value={formData.direccion} onChange={e => handleChange('direccion', e.target.value)} />;
      case 'Localidad (opcional)':
        return <Input size="large" placeholder="Posadas" value={formData.localidad} onChange={e => handleChange('localidad', e.target.value)} />;
      case 'Provincia':
        return (
          <Select size="large" value={formData.provincia} onChange={value => handleChange('provincia', value)}>
            {PROVINCIAS_ARGENTINAS.map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}
          </Select>
        );
      case 'Fecha de nacimiento (opcional)':
        return (
          <DatePicker
            size="large"
            style={{ width: '100%' }}
            locale={locale}
            format="DD/MM/YYYY"
            placeholder="Selecciona fecha"
            value={formData.fecha_nacimiento}
            onChange={date => handleChange('fecha_nacimiento', date)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      title="Editar empleado"
      className={styles.modal}
    >
      <div className={styles.progress}>Paso {currentStep + 1} de {pasos.length}</div>
      <h2 className={styles.title}>{pasos[currentStep]}</h2>
      <div className={styles.campo}>
        {renderCampo()}
      </div>
      <div className={styles.botones}>
        {currentStep > 0 && <Button onClick={handleBack}>Atrás</Button>}
        <Button type="primary" onClick={handleNext}>
          {currentStep === pasos.length - 1 ? 'Guardar cambios' : 'Siguiente'}
        </Button>
      </div>
    </Modal>
  );
}