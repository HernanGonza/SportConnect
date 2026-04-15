// src/pages/PanelUsuario.jsx
import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, Calendar, Activity, MapPin, Clock, ArrowRight, TrendingUp 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import Sidebar from '../components/Sidebar';
import supabase from '../services/supabaseClient';

// Mock data for the chart (simulating monthly activity)
const dataActividad = [
  { name: 'Ene', partidos: 4 },
  { name: 'Feb', partidos: 6 },
  { name: 'Mar', partidos: 3 },
  { name: 'Abr', partidos: 8 },
  { name: 'May', partidos: 5 },
  { name: 'Jun', partidos: 9 },
];

export default function PanelUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      // MOCK DATA FOR PREVIEW (Comentar para producción)
      // if (!user) {
      //   setUsuario({
      //     nombre: 'Juan Pérez',
      //     categoria: '3ra',
      //     email: 'juan@demo.com'
      //   });
      //   setReservas([
      //     {
      //       id: 'mock-1',
      //       fecha: '2026-02-10',
      //       hora_inicio: '18:00:00',
      //       hora_fin: '19:30:00',
      //       precio_total: 22000,
      //       canchas: {
      //         nombre: 'Cancha Central',
      //         complejos: { nombre: 'Padel Pro Center', direccion: 'Av. Costanera 123' }
      //       }
      //     },
      //     {
      //       id: 'mock-2',
      //       fecha: '2026-02-15',
      //       hora_inicio: '20:00:00',
      //       hora_fin: '21:30:00',
      //       precio_total: 20000,
      //       canchas: {
      //         nombre: 'Cancha 2',
      //         complejos: { nombre: 'Club Atlético', direccion: 'Calle 10' }
      //       }
      //     }
      //   ]);
      //   setLoading(false);
      //   return; 
      // }

      if (!user) {
  // MODO MOCK
  setUsuario({
    nombre: 'Juan Pérez',
    categoria: '3ra',
    email: 'juan@demo.com'
  });

  setReservas([
    {
      id: 'mock-1',
      fecha: '2026-02-10',
      hora_inicio: '18:00:00',
      hora_fin: '19:30:00',
      precio_total: 22000,
      canchas: {
        nombre: 'Cancha Central',
        complejos: { nombre: 'Padel Pro Center', direccion: 'Av. Costanera 123' }
      }
    }
  ]);

  setLoading(false);
  return;
}

      const { data: perfil } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!perfil) {
        navigate('/login', { replace: true });
        return;
      }

      setUsuario(perfil);

      // Cargar próximas reservas
      const hoy = new Date().toISOString().split('T')[0];
      const { data: reservasData } = await supabase
        .from('reservas')
        .select(`
          id,
          fecha,
          hora_inicio,
          hora_fin,
          precio_total,
          canchas (
            nombre,
            complejos (nombre, direccion)
          )
        `)
        .eq('usuario_id', user.id)
        .gte('fecha', hoy)
        .order('fecha', { ascending: true })
        .limit(5);

      setReservas(reservasData || []);
      setLoading(false);
    };

    cargarDatos();
  }, [navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Spin size="large" /></div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userType="jugador" userName={usuario.nombre} />
      
      <main className="flex-1 lg:ml-72 p-8 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto space-y-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-heading font-bold text-secondary">
                Hola, <span className="text-primary">{usuario.nombre}</span> 👋
              </h1>
              <p className="text-slate-500 mt-2 text-lg">Aquí está el resumen de tu actividad deportiva.</p>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Nivel Actual</p>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                <Trophy className="text-yellow-500" size={20} />
                <span className="font-bold text-secondary">{usuario.categoria || 'Amateur'}</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Calendar className="text-primary" size={24} />
                  </div>
                  <span className="font-medium text-slate-300">Próximo Partido</span>
                </div>
                {reservas.length > 0 ? (
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{new Date(reservas[0].fecha + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric' })}</h3>
                    <p className="text-primary font-medium">{reservas[0].hora_inicio.slice(0, 5)} hs - {reservas[0].canchas?.complejos?.nombre}</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold mb-1">Sin reservas</h3>
                    <p className="text-slate-400 text-sm">¡Reserva tu cancha hoy!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Activity className="text-blue-500" size={24} />
                </div>
                <span className="font-medium text-slate-500">Partidos Jugados</span>
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-4xl font-bold text-secondary">12</h3>
                <span className="text-green-500 text-sm font-bold mb-1 flex items-center">
                  <TrendingUp size={14} className="mr-1" /> +2 este mes
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-xl">
                  <Trophy className="text-purple-500" size={24} />
                </div>
                <span className="font-medium text-slate-500">Torneos</span>
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-4xl font-bold text-secondary">1</h3>
                <span className="text-slate-400 text-sm font-medium mb-1">Participación activa</span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Próximas Reservas (Tickets) */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-secondary">Mis Reservas</h2>
                <button 
                  onClick={() => navigate('/reservar')}
                  className="text-primary font-bold hover:text-primary-hover transition-colors flex items-center gap-1"
                >
                  Nueva Reserva <ArrowRight size={18} />
                </button>
              </div>

              {reservas.length > 0 ? (
                <div className="space-y-4">
                  {reservas.map((reserva, idx) => (
                    <motion.div 
                      key={reserva.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-3xl p-0 shadow-sm border border-slate-100 flex overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Left color bar */}
                      <div className="w-3 bg-primary"></div>
                      
                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium uppercase tracking-wide">
                            <Calendar size={14} />
                            {new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </div>
                          <h3 className="text-2xl font-bold text-secondary">{reserva.canchas?.complejos?.nombre}</h3>
                          <div className="flex flex-wrap gap-4 text-slate-600">
                            <div className="flex items-center gap-1">
                              <MapPin size={16} className="text-primary" />
                              <span className="text-sm">{reserva.canchas?.complejos?.direccion || 'Ubicación no disp.'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={16} className="text-primary" />
                              <span className="text-sm font-bold text-secondary">{reserva.hora_inicio.slice(0, 5)} - {reserva.hora_fin.slice(0, 5)}</span>
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                            {reserva.canchas?.nombre}
                          </div>
                        </div>

                        {/* Ticket Divider (Dotted line visually) */}
                        <div className="hidden md:block w-px h-32 border-l-2 border-dashed border-slate-200 relative">
                          <div className="absolute -top-6 -left-3 w-6 h-6 bg-slate-50 rounded-full"></div>
                          <div className="absolute -bottom-6 -left-3 w-6 h-6 bg-slate-50 rounded-full"></div>
                        </div>

                        {/* QR Code Area */}
                        <div className="flex flex-col items-center justify-center gap-2 min-w-[120px]">
                          <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-inner">
                            <QRCodeSVG value={`RESERVA-${reserva.id}`} size={80} level="M" />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Scan Me</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 border-dashed">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-slate-300" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-secondary mb-2">No tienes reservas activas</h3>
                  <p className="text-slate-500 mb-6">¿Listo para volver a la cancha?</p>
                  <button 
                    onClick={() => navigate('/reservar')}
                    className="btn-primary py-3 px-6 rounded-xl font-bold shadow-lg shadow-primary/20"
                  >
                    Buscar Canchas
                  </button>
                </div>
              )}
            </motion.div>

            {/* Activity Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-secondary mb-6">Actividad Mensual</h2>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-[400px] flex flex-col justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataActividad}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9', radius: 8 }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="partidos" radius={[6, 6, 6, 6]}>
                      {dataActividad.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 5 ? '#DFFF00' : '#0F172A'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <p className="text-sm text-slate-500">Total de partidos este semestre</p>
                  <p className="text-3xl font-heading font-bold text-secondary mt-1">35</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}