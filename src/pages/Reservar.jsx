// src/pages/Reservar.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, CreditCard, CheckCircle, 
  ArrowLeft, AlertCircle, MapPin, DollarSign 
} from 'lucide-react';
import { message, DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import supabase from '../services/supabaseClient';

dayjs.locale('es');

export default function Reservar() {
  const { canchaId } = useParams();
  const navigate = useNavigate();
  
  const [cancha, setCancha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(dayjs());
  const [reservasExistentes, setReservasExistentes] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [processing, setProcessing] = useState(false);

  // Generar slots de tiempo (ej: 08:00 a 23:30 cada 90 min)
  const generateSlots = () => {
    const slots = [];
    let start = dayjs(fecha).hour(8).minute(0);
    const end = dayjs(fecha).hour(23).minute(30);

    while (start.isBefore(end)) {
      slots.push(start.format('HH:mm'));
      start = start.add(90, 'minute');
    }
    return slots;
  };

  const timeSlots = generateSlots();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener datos de la cancha y club
        const { data: canchaData, error: canchaError } = await supabase
          .from('canchas')
          .select('*, complejos:clubes(nombre, direccion, localidad)')
          .eq('id', canchaId)
          .single();

        if (canchaError) throw canchaError;
        setCancha(canchaData);

        // 2. Obtener reservas existentes para la fecha seleccionada
        const fechaStr = fecha.format('YYYY-MM-DD');
        const { data: reservas, error: reservasError } = await supabase
          .from('reservas')
          .select('hora_inicio')
          .eq('cancha_id', canchaId)
          .eq('fecha', fechaStr)
          .neq('estado_pago', 'cancelado');

        if (reservasError) throw reservasError;
        setReservasExistentes(reservas?.map(r => r.hora_inicio.slice(0, 5)) || []);

      } catch (error) {
        console.error('Error:', error);
        message.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    if (canchaId) fetchData();
  }, [canchaId, fecha]);

  const handleConfirmar = async () => {
    if (!selectedSlot) return;

    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // MOCK RESERVATION
      if (!user) {
        setTimeout(() => {
           message.success('¡Reserva SIMULADA exitosa! (Modo Vista Previa)');
           navigate('/panel-usuario');
        }, 1500);
        return;
      }

      if (!user) {
        message.warning('Debes iniciar sesión para reservar');
        navigate('/login');
        return;
      }

      // Calcular hora fin (90 min despues)
      const [horas, minutos] = selectedSlot.split(':').map(Number);
      const horaInicio = dayjs(fecha).hour(horas).minute(minutos);
      const horaFin = horaInicio.add(90, 'minute').format('HH:mm:00');

      const { error } = await supabase.from('reservas').insert({
        cancha_id: canchaId,
        usuario_id: user.id,
        club_id: cancha.club_id,
        fecha: fecha.format('YYYY-MM-DD'),
        hora_inicio: selectedSlot,
        hora_fin: horaFin,
        precio_total: cancha.precio_hora * 1.5 || 20000, // Precio estimado si no hay
        estado_pago: metodoPago === 'mercado_pago' ? 'pendiente' : 'pagado', // Simulado
        metodo_pago: metodoPago
      });

      if (error) throw error;

      message.success('¡Reserva confirmada exitosamente!');
      navigate('/panel-usuario'); // Redirigir a mis reservas
    } catch (error) {
      console.error('Error reservando:', error);
      message.error(error.message || 'Error al procesar la reserva');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );

  if (!cancha) return null;

  const isSlotOccupied = (time) => reservasExistentes.includes(time);
  const isPast = (time) => {
    if (!dayjs().isSame(fecha, 'day')) return false;
    const [h, m] = time.split(':');
    return dayjs().hour(h).minute(m).isBefore(dayjs());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar de Resumen (Izquierda en desktop, Arriba en mobile) */}
      <div className="md:w-1/3 lg:w-1/4 bg-white border-r border-slate-100 p-6 md:p-8 flex flex-col">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-secondary transition-colors mb-8 font-bold"
        >
          <ArrowLeft size={20} /> Volver
        </button>

        <div className="flex-1">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Tu Reserva</span>
          <h1 className="text-2xl font-heading font-bold text-secondary mt-2 mb-1">{cancha.nombre}</h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
            <MapPin size={16} />
            {cancha.complejos?.nombre}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <CalendarIcon className="text-primary" size={20} />
                <span className="font-bold text-secondary">Fecha</span>
              </div>
              <p className="text-slate-600 pl-8 capitalize">{fecha.format('dddd, D [de] MMMM')}</p>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${selectedSlot ? 'bg-primary/10 border-primary' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Clock className={selectedSlot ? 'text-primary' : 'text-slate-400'} size={20} />
                <span className={`font-bold ${selectedSlot ? 'text-secondary' : 'text-slate-400'}`}>Horario</span>
              </div>
              <p className={`pl-8 ${selectedSlot ? 'text-secondary font-bold text-xl' : 'text-slate-400'}`}>
                {selectedSlot ? `${selectedSlot} hs` : 'Selecciona una hora'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="text-green-600" size={20} />
                <span className="font-bold text-secondary">Precio Total</span>
              </div>
              <p className="text-2xl font-bold text-secondary pl-8">
                ${(cancha.precio_hora * 1.5 || 20000).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 hidden md:block">
           {/* Botón Desktop */}
           <button 
            onClick={handleConfirmar}
            disabled={!selectedSlot || processing}
            className="w-full btn-primary py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? 'Procesando...' : 'Confirmar Reserva'}
            {!processing && <CheckCircle size={20} />}
          </button>
        </div>
      </div>

      {/* Main Content (Selección) */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Selector de Fecha */}
          <section>
            <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <CalendarIcon className="text-primary" /> Elige el día
            </h2>
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 inline-block">
               {/* Usamos Ant Design DatePicker pero estilizado o simple input date */}
               <input 
                 type="date" 
                 className="p-3 text-lg font-bold text-secondary outline-none rounded-xl hover:bg-slate-50 cursor-pointer"
                 value={fecha.format('YYYY-MM-DD')}
                 min={dayjs().format('YYYY-MM-DD')}
                 onChange={(e) => {
                   setFecha(dayjs(e.target.value));
                   setSelectedSlot(null);
                 }}
               />
            </div>
          </section>

          {/* Grid de Horarios */}
          <section>
            <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <Clock className="text-primary" /> Horarios disponibles
            </h2>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {timeSlots.map((time) => {
                const occupied = isSlotOccupied(time);
                const past = isPast(time);
                const disabled = occupied || past;
                const isSelected = selectedSlot === time;

                return (
                  <button
                    key={time}
                    disabled={disabled}
                    onClick={() => setSelectedSlot(time)}
                    className={`
                      relative p-3 rounded-xl border-2 text-center transition-all
                      ${isSelected 
                        ? 'border-primary bg-primary text-secondary font-bold shadow-lg transform scale-105 z-10' 
                        : disabled 
                          ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed' 
                          : 'border-slate-100 bg-white text-slate-600 hover:border-primary/50 hover:bg-slate-50'
                      }
                    `}
                  >
                    <span className="text-lg block">{time}</span>
                    {occupied && <span className="text-[10px] uppercase font-bold text-red-300 block">Ocupado</span>}
                    {past && !occupied && <span className="text-[10px] uppercase font-bold text-slate-300 block">Pasado</span>}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 flex gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-slate-200"></div>
                Disponible
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary"></div>
                Seleccionado
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-100 border-2 border-slate-100"></div>
                No disponible
              </div>
            </div>
          </section>

          {/* Método de Pago */}
          <section className="pt-8 border-t border-slate-100">
             <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <CreditCard className="text-primary" /> Forma de pago
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setMetodoPago('efectivo')}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${metodoPago === 'efectivo' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:bg-slate-50'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${metodoPago === 'efectivo' ? 'border-primary' : 'border-slate-300'}`}>
                  {metodoPago === 'efectivo' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                </div>
                <div className="text-left">
                  <span className="font-bold text-secondary block">Efectivo en el club</span>
                  <span className="text-xs text-slate-500">Pagas al llegar a la cancha</span>
                </div>
              </button>

              <button 
                onClick={() => setMetodoPago('mercado_pago')}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${metodoPago === 'mercado_pago' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:bg-slate-50'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${metodoPago === 'mercado_pago' ? 'border-primary' : 'border-slate-300'}`}>
                  {metodoPago === 'mercado_pago' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                </div>
                <div className="text-left">
                  <span className="font-bold text-secondary block">Mercado Pago</span>
                  <span className="text-xs text-slate-500">Tarjetas, débito o dinero en cuenta</span>
                </div>
              </button>
            </div>
          </section>

          {/* Mobile Floating Button */}
          <div className="md:hidden sticky bottom-4 z-20">
             <button 
              onClick={handleConfirmar}
              disabled={!selectedSlot || processing}
              className="w-full btn-primary py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? 'Procesando...' : `Confirmar ($${(cancha.precio_hora * 1.5 || 20000).toLocaleString()})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}