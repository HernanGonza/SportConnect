// src/components/ProductosView.jsx
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, message, Space, Popconfirm } from 'antd';
import { Archive, Edit, Trash } from 'lucide-react'; // ← iconos animados
import supabase from '../services/supabaseClient';
import CrearProductoModal from '../components/CrearProductoModal';
import EditarProductoModal from '../components/EditarProductoModal';
import { eliminarProducto } from '../services/authService';
import styles from './ProductosView.module.css';

export default function ProductosView({ clubId }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  const cargarProductos = useCallback(async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('club_id', clubId);

    if (error) {
      message.error('Error cargando productos');
    } else {
      setProductos(data || []);
    }
    setLoading(false);
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      setLoading(true);
      cargarProductos();
    }
  }, [clubId, cargarProductos]);

  const handleSuccess = () => {
    cargarProductos();
  };

  const handleEditar = (record) => {
    setProductoEditar(record);
    setModalEditarVisible(true);
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarProducto(id);
      message.success('Producto eliminado');
      handleSuccess();
    } catch (err) {
      message.error(err.message || 'Error al eliminar');
    }
  };

  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Precio', dataIndex: 'precio', key: 'precio', render: (p) => `$${p}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Categoría', dataIndex: 'categoria', key: 'categoria' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEditar(record)}>
            <Edit className="animate-bounce" size={16} />
          </Button>
          <Popconfirm title="¿Eliminar?" onConfirm={() => handleEliminar(record.id)}>
            <Button type="link" danger>
              <Trash className="animate-bounce" size={16} />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Stock / Tienda</h2>
        <Button type="primary" onClick={() => setModalCrearVisible(true)}>
          <Archive className="animate-spin" size={16} /> Agregar producto
        </Button>
      </div>

      <Table className={styles.table} dataSource={productos} columns={columns} rowKey="id" loading={loading} />

      <CrearProductoModal
        visible={modalCrearVisible}
        onCancel={() => setModalCrearVisible(false)}
        onSuccess={handleSuccess}
      />

      <EditarProductoModal
        visible={modalEditarVisible}
        onCancel={() => setModalEditarVisible(false)}
        producto={productoEditar}
        onSuccess={handleSuccess}
      />
    </div>
  );
}