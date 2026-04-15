// src/pages/PanelClub.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Users, TrendingUp, Calendar, DollarSign, Activity, 
  MoreVertical, Edit, Trash2, Plus, Search, Filter 
} from 'lucide-react';
import { message } from 'antd';
import Sidebar from '../components/Sidebar';
import CrearEmpleadoModal from '../components/CrearEmpleadoModal';
import EditarEmpleadoModal from '../components/EditarEmpleadoModal';
import ProductosView from '../components/ProductosView';
import CanchasView from '../components/CanchasView';
import ReservasClubView from '../components/ReservasClubView';
import VentasView from '../components/VentasView';
import StockView from '../components/StockView';
import PromocionesView from '../components/PromocionesView';
import ConfiguracionClubView from '../components/ConfiguracionClubView';
import { eliminarEmpleado } from '../services/authService';


// =======================
// MOCK MODE
// =======================

const MOCK_MODE = true;


// =======================
// Dashboard
// =======================

const DashboardView = ({ club }) => {
  const stats = [
    { label: 'Ingresos del día', value: '$125.000', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Reservas hoy', value: '18', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Canchas activas', value: '4/4', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Nuevos clientes', value: '+12', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-secondary">
            Hola, <span className="text-primary">{club?.nombre}</span> 👋
          </h1>
          <p className="text-slate-500 mt-2">Aquí tienes el resumen de tu complejo hoy.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
            Nueva Reserva
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-secondary">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-secondary">Ocupación Semanal</h3>
            <button className="text-primary text-sm font-bold">Ver reporte</button>
          </div>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Gráfico de ocupación próximamente</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-secondary mb-6">Actividad Reciente</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                  JR
                </div>
                <div>
                  <p className="text-sm font-bold text-secondary">Juan Rodriguez reservó Cancha 1</p>
                  <p className="text-xs text-slate-400">Hace 5 minutos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};


// =======================
// Empleados (MOCK)
// =======================

const EmpleadosView = ({ clubId }) => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [empleadoEditar, setEmpleadoEditar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (MOCK_MODE) {
      setEmpleados([
        { id: 1, nombre: 'Juan Perez', email: 'juan@mail.com', rol: 'admin' },
        { id: 2, nombre: 'Maria Gomez', email: 'maria@mail.com', rol: 'empleado' },
        { id: 3, nombre: 'Carlos Lopez', email: 'carlos@mail.com', rol: 'empleado' }
      ]);
      setLoading(false);
    }
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este empleado?')) return;
    setEmpleados(prev => prev.filter(emp => emp.id !== id));
    message.success('Empleado eliminado');
  };

  const handleEditar = (empleado) => {
    setEmpleadoEditar(empleado);
    setModalEditarVisible(true);
  };

  const filteredEmpleados = empleados.filter(emp => 
    emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Equipo de Trabajo</h2>
          <p className="text-slate-500">Gestiona los accesos y roles de tus empleados</p>
        </div>
        <button 
          onClick={() => setModalCrearVisible(true)}
          className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> Nuevo Empleado
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o email..." 
          className="flex-1 outline-none text-slate-600 placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmpleados.map((emp) => (
            <motion.div 
              key={emp.id}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-2xl font-bold text-slate-400 mb-4">
                  {emp.nombre[0].toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-secondary">{emp.nombre}</h3>
                <p className="text-slate-500 text-sm mb-3">{emp.email}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  emp.rol === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {emp.rol}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CrearEmpleadoModal
        visible={modalCrearVisible}
        onCancel={() => setModalCrearVisible(false)}
        clubId={clubId}
        onSuccess={() => {}}
      />

      <EditarEmpleadoModal
        visible={modalEditarVisible}
        onCancel={() => setModalEditarVisible(false)}
        empleado={empleadoEditar}
        onSuccess={() => {}}
      />
    </motion.div>
  );
};


// =======================
// MAIN
// =======================

export default function PanelClub() {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (MOCK_MODE) {
      setClub({
        id: 'mock-club',
        nombre: 'Padel Center Demo',
        foto_url: null,
        direccion: 'Av. Siempre Viva 123'
      });
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );

  if (!club) return <div>Error: No se encontró el club.</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        userType="club" 
        userName={club?.nombre || 'Club'} 
        userPhoto={club?.foto_url}
      />
      
      <main className="flex-1 lg:pl-72 min-h-screen transition-all duration-300">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route index element={<DashboardView club={club} />} />
            <Route path="empleados" element={<EmpleadosView clubId={club?.id} />} />
            <Route path="productos" element={<ProductosView clubId={club?.id} />} />
            <Route path="canchas" element={<CanchasView clubId={club?.id} />} />
            <Route path="reservas" element={<ReservasClubView clubId={club?.id} />} />
            <Route path="ventas" element={<VentasView clubId={club?.id} />} />
            <Route path="stock" element={<StockView clubId={club?.id} />} />
            <Route path="promociones" element={<PromocionesView clubId={club?.id} />} />
            <Route path="configuracion" element={<ConfiguracionClubView clubId={club?.id} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}