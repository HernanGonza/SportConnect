// src/components/CrearCanchaModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Input, Select, message, Space } from 'antd';
import { crearCancha } from '../services/authService';
import styles from './CrearCanchaModal.module.css';

const pasos = [
  'Nombre',
  'Tipo',
];

export default function CrearCanchaModal({ visible, onCancel, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'indoor',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep === pasos.length - 1) {
      try {
        await crearCancha(
          formData.nombre,
          formData.tipo,
        );
        message.success('Cancha creada');
        onSuccess();
        onCancel();
      } catch (err) {
        message.error(err.message || 'Error al crear cancha');
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
        return <Input size="large" placeholder="Cancha 1" value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} />;
      case 'Tipo':
        return (
          <Select size="large" value={formData.tipo} onChange={value => handleChange('tipo', value)}>
            <Select.Option value="indoor">Indoor</Select.Option>
            <Select.Option value="outdoor">Outdoor</Select.Option>
            <Select.Option value="cubierta">Cubierta</Select.Option>
            <Select.Option value="abierta">Abierta</Select.Option>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} title="Crear cancha" className={styles.modal}>
      <div className={styles.progress}>Paso {currentStep + 1} de {pasos.length}</div>
      <h2 className={styles.title}>{pasos[currentStep]}</h2>
      <div className={styles.campo}>
        {renderCampo()}
      </div>
      <div className={styles.botones}>
        {currentStep > 0 && <Button onClick={handleBack}>Atrás</Button>}
        <Button type="primary" onClick={handleNext}>
          {currentStep === pasos.length - 1 ? 'Crear' : 'Siguiente'}
        </Button>
      </div>
    </Modal>
  );
}