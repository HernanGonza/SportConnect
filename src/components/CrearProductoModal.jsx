// src/components/CrearProductoModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Input, InputNumber, Select, message, Space } from 'antd';
import { crearProducto } from '../services/authService';
import styles from './CrearProductoModal.module.css';

const pasos = [
  'Nombre',
  'Precio',
  'Stock inicial',
  'Categoría (opcional)',
];

export default function CrearProductoModal({ visible, onCancel, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: 0,
    stock: 0,
    categoria: 'general',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep === pasos.length - 1) {
      try {
        await crearProducto(
          formData.nombre,
          formData.precio,
          formData.stock,
          formData.categoria
        );
        message.success('Producto creado');
        onSuccess();
        onCancel();
      } catch (err) {
        message.error(err.message || 'Error al crear producto');
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
        return <Input size="large" placeholder="Ej: Botella de agua" value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} />;
      case 'Precio':
        return (
          <InputNumber size="large" min={0} step={0.01} style={{ width: '100%' }} value={formData.precio} onChange={value => handleChange('precio', value)} />
        );
      case 'Stock inicial':
        return <InputNumber size="large" min={0} style={{ width: '100%' }} value={formData.stock} onChange={value => handleChange('stock', value)} />;
      case 'Categoría (opcional)':
        return (
          <Select size="large" value={formData.categoria} onChange={value => handleChange('categoria', value)}>
            <Select.Option value="general">General</Select.Option>
            <Select.Option value="bebidas">Bebidas</Select.Option>
            <Select.Option value="alquiler">Alquiler</Select.Option>
            <Select.Option value="snacks">Snacks</Select.Option>
            <Select.Option value="accesorios">Accesorios</Select.Option>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} title="Crear producto">
      <div className={styles.stepInfo}>
        Paso {currentStep + 1} de {pasos.length}
      </div>
      <h3 className={styles.stepTitle}>{pasos[currentStep]}</h3>
      <div className={styles.field}>
        {renderCampo()}
      </div>
      <Space className={styles.buttons}>
        {currentStep > 0 && <Button onClick={handleBack}>Atrás</Button>}
        <Button type="primary" onClick={handleNext}>
          {currentStep === pasos.length - 1 ? 'Crear' : 'Siguiente'}
        </Button>
      </Space>
    </Modal>
  );
}