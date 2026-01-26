// src/pages/RegistroDinamicoClub.jsx
import React, { useState } from 'react';
import { Button, Input, Select, Checkbox, Upload, message, Typography } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  PictureOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { registrarClubCompleto } from '../services/authService';
import { PROVINCIAS_ARGENTINAS } from '../utils/provincias';
import styles from './RegistroDinamicoClub.module.css';

const { TextArea } = Input;
const { Text } = Typography;

const SERVICIOS_POSIBLES = [
  'ducha',
  'cantina',
  'parrilla',
  'alquiler_paletas',
  'alquiler_pelotas',
  'estacionamiento',
  'wifi',
  'tienda',
];

export default function RegistroDinamicoClub() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    localidad: '',
    provincia: 'Misiones',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    cantidad_canchas: 1,
    servicios: [],
    fotoArchivo: null,
    responsable_nombre: '',
    responsable_dni: '',
  });

  const totalSteps = 12;
  const pasos = [
    { id: 'nombre', title: '¿Cuál es el nombre de tu club?' },
    { id: 'direccion', title: '¿Dónde está ubicado?' },
    { id: 'localidad', title: '¿En qué localidad?' },
    { id: 'provincia', title: '¿En qué provincia?' },
    { id: 'telefono', title: 'Teléfono de contacto' },
    { id: 'email', title: 'Email del club' },
    { id: 'password', title: 'Crea una contraseña' },
    { id: 'confirmPassword', title: 'Repite la contraseña' },
    { id: 'cantidad_canchas', title: '¿Cuántas canchas tiene el club?' },
    { id: 'servicios', title: '¿Qué servicios ofrece tu club?' },
    { id: 'fotoArchivo', title: 'Subí una foto del club (opcional)' },
    { id: 'responsable', title: 'Datos del responsable' },
    { id: 'resumen', title: '¡Casi listo!' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServicioToggle = (servicio) => {
    setFormData(prev => {
      const nuevos = prev.servicios.includes(servicio)
        ? prev.servicios.filter(s => s !== servicio)
        : [...prev.servicios, servicio];
      return { ...prev, servicios: nuevos };
    });
  };

  const handleNext = async () => {
    if (currentStep === totalSteps) {
      try {
        await registrarClubCompleto(
          formData.email,
          formData.password,
          formData.nombre,
          formData.direccion,
          formData.localidad,
          formData.provincia,
          formData.telefono,
          formData.cantidad_canchas,
          formData.servicios,
          formData.fotoArchivo,
          formData.responsable_nombre,
          formData.responsable_dni
        );
        message.success('¡Club registrado exitosamente!');
        window.location.href = '/panel-club';
      } catch (err) {
        message.error(err.message || 'Error al registrar el club');
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const currentPaso = pasos[currentStep] || { title: '' };

  const renderPregunta = () => {
    switch (currentPaso.id) {
      case 'nombre':
        return (
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Ej: Padel Misiones"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
          />
        );

      case 'direccion':
        return (
          <TextArea
            size="large"
            prefix={<HomeOutlined />}
            placeholder="Calle 123"
            rows={2}
            value={formData.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
          />
        );

      case 'localidad':
        return (
          <Input
            size="large"
            prefix={<EnvironmentOutlined />}
            placeholder="Posadas"
            value={formData.localidad}
            onChange={(e) => handleChange('localidad', e.target.value)}
          />
        );

      case 'provincia':
        return (
          <Select
            size="large"
            style={{ width: '100%' }}
            value={formData.provincia}
            onChange={(value) => handleChange('provincia', value)}
            options={PROVINCIAS_ARGENTINAS.map(p => ({ label: p, value: p }))}
          />
        );

      case 'telefono':
        return (
          <Input
            size="large"
            prefix={<PhoneOutlined />}
            placeholder="3764123456"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
          />
        );

      case 'email':
        return (
          <Input
            size="large"
            prefix={<MailOutlined />}
            type="email"
            placeholder="club@ejemplo.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        );

      case 'password':
        return (
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
        );

      case 'confirmPassword':
        return (
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />
        );

      case 'cantidad_canchas':
        return (
          <Input
            size="large"
            type="number"
            min={1}
            max={50}
            placeholder="Ej: 4"
            value={formData.cantidad_canchas}
            onChange={(e) => handleChange('cantidad_canchas', parseInt(e.target.value) || 1)}
          />
        );

      case 'servicios':
        return (
          <div className={styles.serviciosGrid}>
            {SERVICIOS_POSIBLES.map(servicio => {
              const nombres = {
                ducha: 'Duchas',
                cantina: 'Cantina',
                parrilla: 'Parrillas',
                alquiler_paletas: 'Alquiler de paletas',
                alquiler_pelotas: 'Alquiler de pelotas',
                estacionamiento: 'Estacionamiento',
                wifi: 'Wi-Fi',
                tienda: 'Tienda',
              };
              return (
                <Checkbox
                  key={servicio}
                  checked={formData.servicios.includes(servicio)}
                  onChange={() => handleServicioToggle(servicio)}
                >
                  {nombres[servicio]}
                </Checkbox>
              );
            })}
          </div>
        );

      case 'fotoArchivo':
        return (
          <Upload.Dragger
            beforeUpload={(file) => {
              handleChange('fotoArchivo', file);
              return false;
            }}
            showUploadList={false}
            accept="image/*"
          >
            {formData.fotoArchivo ? (
              <img
                src={URL.createObjectURL(formData.fotoArchivo)}
                alt="Vista previa"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
              />
            ) : (
              <div>
                <PictureOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                <div style={{ marginTop: 8 }}>Haz clic o arrastra una imagen</div>
                <Text type="secondary">JPG, PNG o WEBP</Text>
              </div>
            )}
          </Upload.Dragger>
        );

      case 'responsable':
        return (
          <div className={styles.responsableForm}>
            <div className={styles.formItem}>
              <label>Nombre del responsable</label>
              <Input
                placeholder="Nombre completo"
                value={formData.responsable_nombre}
                onChange={(e) => handleChange('responsable_nombre', e.target.value)}
              />
            </div>
            <div className={styles.formItem}>
              <label>DNI del responsable</label>
              <Input
                placeholder="12345678"
                value={formData.responsable_dni}
                onChange={(e) => handleChange('responsable_dni', e.target.value)}
              />
            </div>
          </div>
        );

      case 'resumen':
        return (
          <div className={styles.resumen}>
            <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
            <Text strong>Registro de {formData.nombre}</Text>
            <div style={{ textAlign: 'left', marginTop: '24px', fontSize: '0.95rem' }}>
              <p><strong>Dirección:</strong> {formData.direccion}, {formData.localidad}, {formData.provincia}</p>
              <p><strong>Teléfono:</strong> {formData.telefono}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Canchas:</strong> {formData.cantidad_canchas}</p>
              <p><strong>Servicios:</strong> {formData.servicios.length > 0 ? formData.servicios.map(s => {
                const names = { ducha: 'Duchas', cantina: 'Cantina', parrilla: 'Parrillas', alquiler_paletas: 'Alquiler de paletas', alquiler_pelotas: 'Alquiler de pelotas', estacionamiento: 'Estacionamiento', wifi: 'Wi-Fi', tienda: 'Tienda' };
                return names[s] || s;
              }).join(', ') : 'Ninguno'}</p>
              {formData.fotoArchivo && <p><strong>Foto:</strong> Seleccionada</p>}
              <p><strong>Responsable:</strong> {formData.responsable_nombre} (DNI: {formData.responsable_dni})</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.contenedor}>
      <div className={styles.tarjeta}>
        <div className={styles.progreso}>
          Paso {currentStep + 1} de {totalSteps + 1}
        </div>

        <h2>{currentPaso.title}</h2>

        <div className={styles.pregunta}>
          {renderPregunta()}
        </div>

        <div className={styles.botones}>
          {currentStep > 0 && (
            <Button onClick={handleBack} style={{ marginRight: '12px' }}>
              Atrás
            </Button>
          )}
          <Button
            type="primary"
            onClick={handleNext}
            disabled={
              (currentPaso.id === 'confirmPassword' && formData.password !== formData.confirmPassword)
            }
          >
            {currentStep === totalSteps ? 'Confirmar registro' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  );
}