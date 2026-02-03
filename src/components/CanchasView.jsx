// src/components/CanchasView.jsx
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { Plus, Edit, Trash2, Zap, LayoutGrid, CheckCircle } from 'lucide-react';
import CrearCanchaModal from './CrearCanchaModal';
import EditarCanchaModal from './EditarCanchaModal';
import supabase from '../services/supabaseClient';
import { eliminarCancha } from '../services/authService';

export default function CanchasView({ clubId }) {
  const [canchas, setCanchas] = useState([]);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [canchaEditar, setCanchaEditar] = useState(null);
  const [preciosDinamicosGlobal, setPreciosDinamicosGlobal] = useState(true);
  const [precioBaseGlobal, setPrecioBaseGlobal] = useState(20000);

  const cargarCanchas = useCallback(async () => {
    // MOCK DATA for Preview Mode
    if (clubId === 'mock-club') {
      setCanchas([
        { id: 1, nombre: 'Cancha Central', tipo: 'Padel Cristal', estado: 'disponible', precio: 22000 },
        { id: 2, nombre: 'Cancha 2', tipo: 'Padel Cristal', estado: 'ocupada', precio: 20000 },
        { id: 3, nombre: 'Cancha 3', tipo: 'Muro', estado: 'mantenimiento', precio: 15000 },
        { id: 4, nombre: 'Cancha 4', tipo: 'Muro', estado: 'disponible', precio: 15000 },
      ]);
      return;
    }

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
    if(!window.confirm('¿Seguro que deseas eliminar esta cancha?')) return;
    try {
      await eliminarCancha(id);
      message.success('Cancha eliminada');
      handleSuccess();
    } catch (err) {
      message.error(err.message || 'Error al eliminar cancha');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-slate-900">Gestión de Canchas</h2>
          <p className="text-slate-500">Administra tus espacios y precios.</p>
        </div>
        <button 
          onClick={() => setModalCrearVisible(true)}
          className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> Crear Cancha
        </button>
      </div>

      {/* Global Settings Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Precios Dinámicos</h3>
            <p className="text-sm text-slate-500">Ajuste automático según demanda.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <span className="text-sm font-bold text-slate-500">Base:</span>
            <span className="font-bold text-slate-900">${precioBaseGlobal.toLocaleString()}</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={preciosDinamicosGlobal} 
              onChange={(e) => setPreciosDinamicosGlobal(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Grid de Canchas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...canchas]
          .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { numeric: true }))
          .map((cancha) => (
            <div 
              key={cancha.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-primary/20 group-hover:text-slate-900 transition-colors">
                  <LayoutGrid size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  cancha.estado === 'disponible' ? 'bg-green-100 text-green-700' :
                  cancha.estado === 'ocupada' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {cancha.estado}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">{cancha.nombre}</h3>
              <p className="text-slate-500 text-sm mb-6 capitalize">{cancha.tipo || 'Padel Estándar'}</p>

              <div className="pt-6 border-t border-slate-100 flex gap-2">
                <button 
                  onClick={() => handleEditar(cancha)}
                  className="flex-1 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={16} /> Editar
                </button>
                <button 
                  onClick={() => handleEliminar(cancha.id)}
                  className="flex-1 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
      </div>

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
