// src/pages/ComplejoDetalle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Phone, Star, Clock, ShieldCheck, 
  Wifi, Coffee, Car, ArrowLeft, Calendar, Info 
} from 'lucide-react';
import { message } from 'antd';
import supabase from '../services/supabaseClient';

export default function ComplejoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('canchas');

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        // MOCK DATA FALLBACK
        if (!id || id === 'demo') {
           setClub({
             id: 'demo',
             nombre: 'Complejo Demo Premium',
             direccion: 'Av. Costanera 1234',
             localidad: 'Posadas',
             telefono: '3764123456',
             descripcion: 'El mejor complejo de la ciudad con canchas de cristal y césped sintético.',
             servicios: ['wifi', 'bar', 'estacionamiento', 'seguridad'],
             foto_url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop'
           });
           setCanchas([
             { id: 'c1', nombre: 'Cancha 1 - Central', tipo: 'Padel Cristal', precio_hora: 20000 },
             { id: 'c2', nombre: 'Cancha 2', tipo: 'Padel Cristal', precio_hora: 18000 },
             { id: 'c3', nombre: 'Cancha 3', tipo: 'Muro', precio_hora: 15000 },
           ]);
           setLoading(false);
           return;
        }

        // Fetch club details
        const { data: clubData, error: clubError } = await supabase
          .from('clubes')
          .select('*')
          .eq('id', id)
          .single();

        if (clubError) throw clubError;

        // Fetch courts
        const { data: canchasData, error: canchasError } = await supabase
          .from('canchas')
          .select('*')
          .eq('club_id', id)
          .eq('estado', 'disponible'); // Only show available courts

        if (canchasError) throw canchasError;

        setClub(clubData);
        setCanchas(canchasData || []);
      } catch (error) {
        console.error('Error fetching details:', error);
        message.error('No se pudo cargar la información del complejo');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClubDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-secondary mb-2">Complejo no encontrado</h2>
        <p className="text-slate-500 mb-6">El complejo que buscas no existe o no está disponible.</p>
        <button 
          onClick={() => navigate('/')}
          className="btn-primary px-6 py-3 rounded-xl font-bold"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  // Helper to map services to icons
  const getServiceIcon = (service) => {
    const map = {
      wifi: <Wifi size={18} />,
      bar: <Coffee size={18} />,
      estacionamiento: <Car size={18} />,
      seguridad: <ShieldCheck size={18} />,
    };
    return map[service.toLowerCase()] || <Star size={18} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={club.foto_url || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop'} 
          alt={club.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary text-secondary text-xs font-bold rounded-full uppercase tracking-wider">
                Complejo Premium
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={16} fill="currentColor" />
                <span className="font-bold">4.8</span>
                <span className="text-white/60 text-sm">(120 reseñas)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">{club.nombre}</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <span>{club.direccion}, {club.localidad}</span>
              </div>
              <div className="hidden md:block w-1 h-1 bg-white/30 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                <span>Abierto hoy: 08:00 - 23:00</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-30">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-2 overflow-hidden flex mb-8">
          <button 
            onClick={() => setActiveTab('canchas')}
            className={`flex-1 py-4 rounded-2xl font-bold text-center transition-all ${
              activeTab === 'canchas' ? 'bg-secondary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Canchas Disponibles
          </button>
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-4 rounded-2xl font-bold text-center transition-all ${
              activeTab === 'info' ? 'bg-secondary text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Información
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'canchas' ? (
            <motion.div 
              key="canchas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {canchas.length > 0 ? canchas.map((cancha) => (
                <div key={cancha.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-secondary">{cancha.nombre}</h3>
                      <p className="text-slate-500 text-sm capitalize">{cancha.tipo || 'Padel Cristal'}</p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-secondary transition-colors">
                      <ShieldCheck size={24} />
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Wifi size={16} className="text-slate-400" />
                      <span className="text-sm">Iluminación LED</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <ShieldCheck size={16} className="text-slate-400" />
                      <span className="text-sm">Césped sintético premium</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/reservar/${cancha.id}`)}
                    className="w-full py-3 bg-secondary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                  >
                    <Calendar size={18} />
                    Reservar ahora
                  </button>
                </div>
              )) : (
                <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-500 font-medium">No hay canchas disponibles en este momento.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-3 gap-8"
            >
              <div className="md:col-span-2 space-y-8">
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                    <Info size={20} className="text-primary" />
                    Sobre nosotros
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {club.descripcion || 'Disfruta de las mejores instalaciones deportivas de la ciudad. Contamos con canchas de última generación, vestuarios de primer nivel y un ambiente ideal para compartir con amigos después del partido.'}
                  </p>
                </section>

                <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-secondary mb-4">Servicios</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(club.servicios || ['wifi', 'bar', 'estacionamiento']).map((service, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-primary">{getServiceIcon(service)}</div>
                        <span className="text-sm font-medium text-slate-600 capitalize">{service}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-secondary mb-4">Contacto</h3>
                  <div className="space-y-4">
                    <a href={`tel:${club.telefono}`} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Teléfono</p>
                        <p className="text-secondary font-medium">{club.telefono || 'No disponible'}</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Dirección</p>
                        <p className="text-secondary font-medium">{club.direccion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}