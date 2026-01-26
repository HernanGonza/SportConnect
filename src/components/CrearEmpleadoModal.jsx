// src/components/CrearEmpleadoModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Input, Select, DatePicker, message } from 'antd';
import locale from 'antd/es/date-picker/locale/es_ES';
import { crearEmpleado } from '../services/authService';
import { PROVINCIAS_ARGENTINAS } from '../utils/provincias';
import styles from './CrearEmpleadoModal.module.css';

const pasos = [
  'Nombre',
  'Apellido',
  'DNI',
  'Email',
  'Contraseña',
  'Confirmar contraseña',
  'Teléfono (opcional)',
  'Dirección (opcional)',
  'Localidad (opcional)',
  'Provincia',
  'Fecha de nacimiento (opcional)',
  'Rol',
];

export default function CrearEmpleadoModal({ visible, onCancel, clubId, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: '',
    localidad: '',
    provincia: 'Misiones',
    fecha_nacimiento: null,
    rol: 'empleado',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    const pasoActual = pasos[currentStep];

    // Mapear nombre del paso a clave en formData
    const fieldMap = {
      'Nombre': 'nombre',
      'Apellido': 'apellido',
      'DNI': 'dni',
      'Email': 'email',
      'Contraseña': 'password',
      'Confirmar contraseña': 'confirmPassword',
      'Rol': 'rol',
    };

    const fieldKey = fieldMap[pasoActual] || null;

    // Campos obligatorios
    const requiredSteps = ['Nombre', 'Apellido', 'DNI', 'Email', 'Contraseña', 'Confirmar contraseña', 'Rol'];

    if (requiredSteps.includes(pasoActual) && fieldKey && !formData[fieldKey]) {
      message.error(`Por favor completa ${pasoActual}`);
      return;
    }

    if (currentStep === pasos.length - 1) {
      if (formData.password !== formData.confirmPassword) {
        message.error('Las contraseñas no coinciden');
        return;
      }

      try {
        await crearEmpleado(
          clubId,
          formData.nombre,
          formData.apellido,
          formData.dni,
          formData.email,
          formData.password,
          formData.telefono || null,
          formData.direccion || null,
          formData.localidad || null,
          formData.provincia,
          formData.fecha_nacimiento?.format('YYYY-MM-DD') || null,
          formData.rol
        );

        message.success('Empleado creado exitosamente');
        onSuccess();
        onCancel();
        setCurrentStep(0);
        setFormData({
          nombre: '',
          apellido: '',
          dni: '',
          email: '',
          password: '',
          confirmPassword: '',
          telefono: '',
          direccion: '',
          localidad: '',
          provincia: 'Misiones',
          fecha_nacimiento: null,
          rol: 'empleado',
        });
      } catch (err) {
        message.error(err.message || 'Error al crear empleado');
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
      case 'Contraseña':
        return <Input.Password size="large" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={e => handleChange('password', e.target.value)} />;
      case 'Confirmar contraseña':
        return <Input.Password size="large" placeholder="Repite la contraseña" value={formData.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} />;
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
      case 'Rol':
        return (
          <Select size="large" value={formData.rol} onChange={value => handleChange('rol', value)}>
            <Select.Option value="admin">Administrador</Select.Option>
            <Select.Option value="empleado">Empleado</Select.Option>
            <Select.Option value="cajero">Cajero</Select.Option>
          </Select>
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
      title="Crear nuevo empleado"
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
          {currentStep === pasos.length - 1 ? 'Crear empleado' : 'Siguiente'}
        </Button>
      </div>
    </Modal>
  );
}