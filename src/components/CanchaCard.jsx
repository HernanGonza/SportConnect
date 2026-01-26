// src/components/CanchaCard.jsx
import React from 'react';
import { Card, Tag, Button, Space, Popconfirm } from 'antd';
import { Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import PreciosDinamicos from './PreciosDinamicos';
import styles from './CanchaCard.module.css';

export default function CanchaCard({ 
  cancha, 
  preciosDinamicosGlobal, 
  minPrecio, 
  maxPrecio,
  precioBaseGlobal,
  onEditar, 
  onEliminar, 
  onAgregarConsumo 
}) {
  const getEstadoTag = (estado) => {
    const colors = {
      libre: 'green',
      reservada: 'blue',
      ocupada: 'red',
      mantenimiento: 'orange',
    };
    return <Tag color={colors[estado] || 'default'}>{estado.toUpperCase()}</Tag>;
  };

  const formatARS = (num) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(num);

  return (
    <Card
      title={cancha.nombre}
      className={styles.card}
      extra={getEstadoTag(cancha.estado)}
    >
      <p>
        <Clock size={16} style={{ marginRight: 8 }} />
        Precio base global: {formatARS(precioBaseGlobal)}
      </p>
      <p>Tipo: {cancha.tipo}</p>

      <PreciosDinamicos
        clubId={cancha.club_id}
        canchaId={cancha.id}
        precioBase={precioBaseGlobal}
        globalActivado={preciosDinamicosGlobal}
        minPrecio={minPrecio}
        maxPrecio={maxPrecio}
      />

      <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
        {cancha.estado === 'ocupada' && (
          <Button block type="primary" onClick={() => onAgregarConsumo(cancha)}>
            <DollarSign size={16} style={{ marginRight: 8 }} />
            Agregar consumo
          </Button>
        )}
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button type="link" onClick={() => onEditar(cancha)}>
            <Edit size={16} />
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar esta cancha?"
            onConfirm={() => onEliminar(cancha.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger>
              <Trash2 size={16} />
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      </Space>
    </Card>
  );
}