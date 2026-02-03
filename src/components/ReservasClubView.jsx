// src/components/ReservasClubView.jsx
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { Calendar, Clock, User, DollarSign, Plus, CheckCircle, XCircle, Filter, Search } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import supabase from '../services/supabaseClient';
import CrearReservaModal from './CrearReservaModal';

dayjs.locale('es');

export default function ReservasClubView({ clubId }) {
  const [reservasHoy, setReservasHoy] = useState([]);
  const [reservasFuturas, setReservasFuturas] = useState([]);
  const [reservasPasadas, setReservasPasadas] = useState([]);
  const [activeTab, setActiveTab] = useState('hoy');
  const [loading, setLoading] = useState(true);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const cargarReservas = useCallback(async () => {
    // MOCK DATA for Preview
    if (clubId === 'mock-club') {
       const mockReservas = [
         { id: '1', fecha: dayjs().format('YYYY-MM-DD'), hora_inicio: '18:00:00', hora_fin: '19:30:00', precio_total: 22000, estado_pago: 'pagado', usuarios: { nombre: 'Juan', apellido: 'Pérez' }, canchas: { nombre: 'Cancha Central' } },
         { id: '2', fecha: dayjs().format('YYYY-MM-DD'), hora_inicio: '20:00:00', hora_fin: '21:30:00', precio_total: 20000, estado_pago: 'pendiente', usuarios: { nombre: 'Carlos', apellido: 'Gómez' }, canchas: { nombre: 'Cancha 2' } },
         { id: '3', fecha: dayjs().add(1, 'day').format('YYYY-MM-DD'), hora_inicio: '10:00:00', hora_fin: '11:30:00', precio_total: 18000, estado_pago: 'pagado', usuarios: { nombre: 'Ana', apellido: 'López' }, canchas: { nombre: 'Cancha 3' } },
       ];
       setReservasHoy(mockReservas.filter(r => r.fecha === dayjs().format('YYYY-MM-DD')));
       setReservasFuturas(mockReservas.filter(r => r.fecha > dayjs().format('YYYY-MM-DD')));
       setReservasPasadas([]);
       setLoading(false);
       return;
    }

    const hoy = dayjs().format('YYYY-MM-DD');

    const { data: todas, error } = await supabase
      .from('reservas')
      .select(`
        id,
        fecha,
        hora_inicio,
        hora_fin,
        precio_total,
        estado_pago,
        usuarios (nombre, apellido),
        canchas (nombre)
      `)
      .eq('club_id', clubId);

    if (error) {
      message.error('Error cargando reservas');
      console.error(error);
      setLoading(false);
      return;
    }

    const hoyList = todas.filter(r => r.fecha === hoy);
    const futuras = todas.filter(r => r.fecha > hoy);
    const pasadas = todas.filter(r => r.fecha < hoy);

    setReservasHoy(hoyList);
    setReservasFuturas(futuras);
    setReservasPasadas(pasadas);
    setLoading(false);
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      setLoading(true);
      cargarReservas();
    }
  }, [clubId, cargarReservas]);

  const getReservasToShow = () => {
    switch (activeTab) {
      case 'hoy': return reservasHoy;
      case 'futuras': return reservasFuturas;
      case 'pasadas': return reservasPasadas;
      default: return [];
    }
  };

  const filteredReservas = getReservasToShow().filter(r => 
    r.usuarios?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.usuarios?.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.canchas?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ReservaCard = ({ reserva }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-center">
      {/* Time Column */}
      <div className="flex flex-col items-center justify-center min-w-[100px] text-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6 w-full md:w-auto">
        <span className="text-3xl font-black text-slate-900">{reserva.hora_inicio.slice(0, 5)}</span>
        <span className="text-sm text-slate-400 font-medium">a {reserva.hora_fin.slice(0, 5)}</span>
      </div>

      {/* Info Column */}
      <div className="flex-1 space-y-2 w-full text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <User size={16} className="text-primary" />
          <h3 className="font-bold text-slate-900 text-lg">
            {reserva.usuarios?.nombre} {reserva.usuarios?.apellido}
          </h3>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 text-sm">
          <span className="px-2 py-1 bg-slate-100 rounded-lg font-bold text-slate-600">
            {reserva.canchas?.nombre}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {dayjs(reserva.fecha).format('DD/MM/YYYY')}
          </span>
        </div>
      </div>

      {/* Status & Price Column */}
      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
        <div className="flex items-center gap-1 text-slate-900 font-bold text-xl">
          <DollarSign size={18} className="text-green-600" />
          {reserva.precio_total.toLocaleString()}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
          reserva.estado_pago === 'pagado' ? 'bg-green-100 text-green-700' :
          reserva.estado_pago === 'seña' ? 'bg-orange-100 text-orange-700' :
          'bg-red-100 text-red-700'
        }`}>
          {reserva.estado_pago === 'pagado' ? <CheckCircle size={12} /> : <XCircle size={12} />}
          {reserva.estado_pago}
        </span>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
        <button className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
          Detalles
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-slate-900">Reservas</h2>
          <p className="text-slate-500">Gestiona los turnos y la ocupación.</p>
        </div>
        <button 
          onClick={() => setModalCrearVisible(true)}
          className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> Nueva Reserva
        </button>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex p-1 bg-slate-50 rounded-xl w-full md:w-auto">
          {['hoy', 'futuras', 'pasadas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto px-2">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar jugador o cancha..." 
            className="flex-1 outline-none text-slate-600 placeholder:text-slate-400 min-w-[200px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredReservas.length > 0 ? (
          filteredReservas.map((reserva) => (
            <ReservaCard key={reserva.id} reserva={reserva} />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-secondary">No hay reservas</h3>
            <p className="text-slate-500">No se encontraron reservas en esta categoría.</p>
          </div>
        )}
      </div>

      <CrearReservaModal
        visible={modalCrearVisible}
        onCancel={() => setModalCrearVisible(false)}
        onSuccess={cargarReservas}
        clubId={clubId}
      />
    </div>
  );
}
