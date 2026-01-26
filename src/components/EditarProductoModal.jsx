// src/components/EditarProductoModal.jsx
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, InputNumber, Select, message, Space } from 'antd'; // ← agregado Space
import { editarProducto } from '../services/authService';

const pasos = [
  'Nombre',
  'Precio',
  'Stock',
  'Categoría (opcional)',
];

export default function EditarProductoModal({ visible, onCancel, producto, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: 0,
    stock: 0,
    categoria: 'general',
  });

  useEffect(() => {
    if (visible && producto) {
      setFormData({
        nombre: producto.nombre || '',
        precio: producto.precio || 0,
        stock: producto.stock || 0,
        categoria: producto.categoria || 'general',
      });
      setCurrentStep(0);
    }
  }, [visible, producto]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep === pasos.length - 1) {
      try {
        await editarProducto(
          producto.id,
          formData.nombre,
          formData.precio,
          formData.stock,
          formData.categoria
        );
        message.success('Producto actualizado correctamente');
        onSuccess();
        onCancel();
      } catch (err) {
        message.error(err.message || 'Error al editar producto');
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
        return <Input size="large" value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} />;
      case 'Precio':
        return <InputNumber size="large" min={0} step={0.01} style={{ width: '100%' }} value={formData.precio} onChange={value => handleChange('precio', value)} />;
      case 'Stock':
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

  if (!visible || !producto) return null;

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} title="Editar producto">
      <div>Paso {currentStep + 1} de {pasos.length}</div>
      <h3>{pasos[currentStep]}</h3>
      {renderCampo()}
      <Space style={{ marginTop: 24 }}>
        {currentStep > 0 && <Button onClick={handleBack}>Atrás</Button>}
        <Button type="primary" onClick={handleNext}>
          {currentStep === pasos.length - 1 ? 'Guardar' : 'Siguiente'}
        </Button>
      </Space>
    </Modal>
  );
}