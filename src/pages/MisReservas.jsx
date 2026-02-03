// src/pages/MisReservas.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Search, Filter, ArrowRight, History } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import supabase from '../services/supabaseClient';
import Sidebar from '../components/Sidebar';

dayjs.locale('es');

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming, past, all
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchReservas = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // MOCK DATA FOR PREVIEW
      if (!user) {
        setUser({ user_metadata: { nombre: 'Jugador Demo' }, id: 'mock-id' });
        setReservas([
          {
            id: 'mock-1',
            fecha: '2026-02-20',
            hora_inicio: '18:00:00',
            hora_fin: '19:30:00',
            precio_total: 22000,
            estado_pago: 'pagado',
            canchas: {
              nombre: 'Cancha Central',
              complejos: { nombre: 'Padel Pro Center', direccion: 'Av. Costanera 123', localidad: 'Posadas' }
            }
          },
          {
            id: 'mock-2',
            fecha: '2026-01-15',
            hora_inicio: '20:00:00',
            hora_fin: '21:30:00',
            precio_total: 20000,
            estado_pago: 'pagado',
            canchas: {
              nombre: 'Cancha 2',
              complejos: { nombre: 'Club Atlético', direccion: 'Calle 10', localidad: 'Posadas' }
            }
          }
        ]);
        setLoading(false);
        return;
      }

      if (!user) return;
      setUser(user);

      const { data, error } = await supabase
        .from('reservas')
        .select(`
          id,
          fecha,
          hora_inicio,
          hora_fin,
          precio_total,
          estado_pago,
          canchas (
            nombre,
            complejos:clubes (nombre, direccion, localidad)
          )
        `)
        .eq('usuario_id', user.id)
        .order('fecha', { ascending: false });

      if (!error) {
        setReservas(data || []);
      }
      setLoading(false);
    };

    fetchReservas();
  }, []);

  const filteredReservas = reservas.filter(r => {
    const isPast = dayjs(r.fecha).isBefore(dayjs(), 'day');
    if (filter === 'upcoming') return !isPast;
    if (filter === 'past') return isPast;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userType="jugador" userName={user?.user_metadata?.nombre || 'Jugador'} />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-secondary">Mis Reservas</h1>
              <p className="text-slate-500 mt-1">Historial completo de tus partidos</p>
            </div>
            
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button 
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'upcoming' ? 'bg-primary text-secondary shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Próximas
              </button>
              <button 
                onClick={() => setFilter('past')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'past' ? 'bg-primary text-secondary shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Historial
              </button>
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-primary text-secondary shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                Todas
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredReservas.length > 0 ? (
                  filteredReservas.map((reserva) => (
                    <motion.div 
                      key={reserva.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`
                        bg-white rounded-3xl p-0 shadow-sm border flex overflow-hidden hover:shadow-md transition-shadow
                        ${dayjs(reserva.fecha).isBefore(dayjs()) ? 'border-slate-100 opacity-80 grayscale-[0.5] hover:grayscale-0' : 'border-slate-100'}
                      `}
                    >
                      {/* Left color bar */}
                      <div className={`w-3 ${dayjs(reserva.fecha).isBefore(dayjs()) ? 'bg-slate-300' : 'bg-primary'}`}></div>
                      
                      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${dayjs(reserva.fecha).isBefore(dayjs()) ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'}`}>
                              {dayjs(reserva.fecha).isBefore(dayjs()) ? 'Finalizado' : 'Confirmado'}
                            </span>
                            <span className="text-slate-400 text-sm font-medium">#{reserva.id.slice(0,8)}</span>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-secondary">
                            {reserva.canchas?.complejos?.nombre}
                          </h3>
                          
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-600">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-primary" />
                              <span className="capitalize">{dayjs(reserva.fecha).format('dddd, D [de] MMMM')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-primary" />
                              <span className="font-bold">{reserva.hora_inicio.slice(0,5)} - {reserva.hora_fin.slice(0,5)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-primary" />
                              <span>{reserva.canchas?.complejos?.localidad}</span>
                            </div>
                          </div>
                        </div>

                        {/* Ticket Divider */}
                        <div className="hidden md:block w-px h-24 border-l-2 border-dashed border-slate-200 relative"></div>

                        {/* QR / Actions */}
                        <div className="flex items-center gap-6">
                           <div className="text-right hidden md:block">
                             <p className="text-xs text-slate-400 uppercase">Cancha</p>
                             <p className="font-bold text-secondary">{reserva.canchas?.nombre}</p>
                             <p className="text-xs text-slate-400 uppercase mt-2">Precio</p>
                             <p className="font-bold text-secondary">${reserva.precio_total}</p>
                           </div>
                           
                           <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-inner">
                             <QRCodeSVG value={`RESERVA-${reserva.id}`} size={64} level="L" />
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <History className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-secondary">No hay reservas</h3>
                    <p className="text-slate-500">No se encontraron reservas en esta categoría.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}