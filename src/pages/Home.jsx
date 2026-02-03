import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import supabase from '../services/supabaseClient';
import { 
  Trophy, Users, Calendar, ArrowRight, ShieldCheck, MapPin, Star, Activity, Search, MousePointerClick, CreditCard, Smile,
  LayoutDashboard, TrendingUp, Clock, Zap, CheckCircle2
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import heroBg from '../assets/images/img-padel.jpeg';

export default function Home() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user && location.pathname === '/') {
        const { data: perfil } = await supabase
          .from('usuarios')
          .select('tipo')
          .eq('id', user.id)
          .single();

        if (perfil?.tipo === 'club') {
          navigate('/panel-club', { replace: true });
        } else {
          navigate('/panel-usuario', { replace: true });
        }
        return;
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [navigate, location]);

  if (checkingAuth) return <div className="h-screen flex items-center justify-center bg-secondary"><Spin size="large" /></div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src={heroBg}
            alt="Padel Court Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center text-white mt-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary mb-6"
          >
            <Trophy size={16} />
            <span className="text-sm font-semibold tracking-wide uppercase">La plataforma #1 de Misiones</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="font-heading font-extrabold text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight tracking-tight text-white drop-shadow-lg"
          >
            EL DEPORTE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-lime-400 drop-shadow-none">EVOLUCIONADO</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          >
            Conectamos jugadores y clubes en una experiencia única. 
            Reserva canchas, organiza torneos y lleva tu juego al siguiente nivel.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/registro/seleccion" 
              className="btn-primary w-full sm:w-auto text-lg py-4 px-8 flex items-center justify-center gap-2 group hover:scale-105 transition-transform"
            >
              Empezar Ahora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto py-4 px-8 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm hover:scale-105"
            >
              Ya tengo cuenta
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary py-12 border-b border-white/5 relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '+50', label: 'Clubes Aliados' },
              { number: '+2k', label: 'Jugadores Activos' },
              { number: '+10k', label: 'Reservas Mensuales' },
              { number: '24/7', label: 'Soporte Activo' }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-4"
              >
                <p className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">{stat.number}</p>
                <p className="text-slate-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-heading font-bold text-secondary mb-4"
            >
              Cómo funciona
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-lg max-w-2xl mx-auto"
            >
              Tu próximo partido está a solo unos clicks de distancia.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
            
            {[
              { icon: Users, title: "1. Regístrate", desc: "Crea tu perfil gratuito en segundos." },
              { icon: Search, title: "2. Busca", desc: "Encuentra canchas por zona y horario." },
              { icon: MousePointerClick, title: "3. Reserva", desc: "Elige tu turno y confirma al instante." },
              { icon: Smile, title: "4. ¡Juega!", desc: "Disfruta del partido con tus amigos." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="text-center bg-white p-6 relative"
              >
                <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg relative z-10 group hover:scale-110 transition-transform duration-300">
                  <step.icon size={40} className="text-primary group-hover:text-primary-hover transition-colors" />
                  <div className="absolute top-0 right-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{step.title}</h3>
                <p className="text-slate-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-heading font-bold text-white mb-4"
            >
              Todo lo que necesitas
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg max-w-2xl mx-auto"
            >
              Una suite completa de herramientas diseñada para potenciar la comunidad del pádel.
            </motion.p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                icon: <Calendar size={32} />,
                title: "Reservas al Instante",
                desc: "Olvídate de llamar. Encuentra cancha disponible y reserva en segundos desde tu celular."
              },
              {
                icon: <Activity size={32} />,
                title: "Torneos y Ligas",
                desc: "Inscríbete en competencias, sigue los resultados en vivo y escala en el ranking provincial."
              },
              {
                icon: <Users size={32} />,
                title: "Comunidad",
                desc: "Encuentra rivales de tu nivel, arma partidos y conoce nuevos compañeros de juego."
              },
              {
                icon: <ShieldCheck size={32} />,
                title: "Pagos Seguros",
                desc: "Sistema de señas y pagos integrado. Transparencia total para clubes y jugadores."
              },
              {
                icon: <MapPin size={32} />,
                title: "Geolocalización",
                desc: "Descubre los complejos más cercanos a tu ubicación con mapas interactivos."
              },
              {
                icon: <Star size={32} />,
                title: "Beneficios Exclusivos",
                desc: "Suma puntos con cada partido y canjealos por descuentos y premios en la tienda."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <div className="text-primary group-hover:text-secondary transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Smart Matching Feature Highlight - High Contrast */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-primary to-lime-400 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(223,255,0,0.3)] relative overflow-hidden group"
          >
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none mix-blend-overlay"></div>

            <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
              <div className="md:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-6">
                  <Star size={12} />
                  Nuevo Feature
                </div>
                <h3 className="text-4xl font-heading font-bold text-secondary mb-6 leading-tight">
                  Nunca te quedes <span className="text-white drop-shadow-md">sin jugar</span>
                </h3>
                <p className="text-secondary/80 text-lg mb-8 leading-relaxed font-medium">
                  ¿Te falta uno para el partido? Nuestro sistema de <strong>Smart Matching</strong> analiza tu nivel, ubicación y disponibilidad para encontrarte el compañero o rival perfecto en segundos.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-secondary font-bold">
                    <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-primary shadow-lg">
                      <TrendingUp size={16} />
                    </div>
                    Nivelación automática (1ª a 8ª categoría)
                  </li>
                  <li className="flex items-center gap-3 text-secondary font-bold">
                    <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-primary shadow-lg">
                      <ShieldCheck size={16} />
                    </div>
                    Historial de confiabilidad y fair play
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 w-full">
                {/* Visual representation of matching */}
                <div className="bg-white/90 p-8 rounded-3xl shadow-2xl relative backdrop-blur-sm transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-xl shadow-lg">
                          J
                       </div>
                       <div>
                         <div className="h-2.5 w-24 bg-slate-200 rounded-full mb-2"></div>
                         <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                       </div>
                     </div>
                     <span className="text-xs font-bold text-white bg-secondary px-3 py-1.5 rounded-full shadow-lg">98% Compatible</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1 font-semibold">
                        <span>Nivel de Juego</span>
                        <span className="text-secondary">8.5/10</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "85%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-secondary"
                        ></motion.div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1 font-semibold">
                        <span>Ubicación</span>
                        <span className="text-secondary">Cerca de ti</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "95%" }}
                          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                          className="h-full bg-secondary"
                        ></motion.div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button className="w-full py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      Ver Perfil Completo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clubes Section */}
      <section id="clubes" className="py-24 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 order-1">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block flex items-center gap-2">
                  <div className="w-8 h-1 bg-secondary rounded-full"></div>
                  Para Clubes
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-secondary">
                  Gestiona tu club como <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">un profesional</span>
                </h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  Olvídate del papel y lápiz. SportConnect te ofrece un panel de control integral para automatizar reservas, controlar caja y fidelizar clientes.
                </p>
                
                <div className="space-y-6">
                  {[
                    { icon: LayoutDashboard, title: "Panel de Control Total", desc: "Vista unificada de todas tus canchas y horarios." },
                    { icon: Zap, title: "Precios Dinámicos", desc: "Ajuste automático de tarifas para maximizar ocupación." },
                    { icon: Users, title: "CRM de Jugadores", desc: "Historial detallado y herramientas de marketing." }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 10 }}
                      className="flex gap-4 group cursor-default"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <item.icon size={24} className="text-slate-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-secondary mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mt-10"
                >
                  <Link to="/registro/club" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Solicitar Demo
                    <ArrowRight size={20} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="md:w-1/2 order-2">
              {/* Animated Dashboard Visual */}
              <motion.div 
                initial={{ opacity: 0, rotateY: -20, x: 50 }}
                whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative perspective-1000"
              >
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <LayoutDashboard className="text-slate-500" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Dashboard</p>
                        <p className="text-secondary font-bold">Resumen Diario</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Estado</p>
                      <div className="flex items-center gap-1.5 text-green-500 text-sm font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        En línea
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-blue-600 text-xs font-bold uppercase mb-1">Reservas Hoy</p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-secondary">24</span>
                        <span className="text-green-500 text-xs font-bold mb-1">▲ 12%</span>
                      </div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                      <p className="text-indigo-600 text-xs font-bold uppercase mb-1">Ingresos</p>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-secondary">$125k</span>
                        <span className="text-green-500 text-xs font-bold mb-1">▲ 8%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated Graph */}
                  <div className="relative h-40 w-full bg-slate-50 rounded-xl p-4 flex items-end justify-between gap-2 overflow-hidden border border-slate-100">
                     {[35, 55, 45, 70, 60, 85, 95].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.1), type: "spring" }}
                          className="flex-1 bg-secondary rounded-t-sm relative group"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {h}% Ocupación
                          </div>
                        </motion.div>
                     ))}
                     {/* Horizontal Lines */}
                     <div className="absolute inset-0 w-full h-full pointer-events-none flex flex-col justify-between p-4">
                       <div className="w-full h-px bg-slate-200 border-t border-dashed border-slate-300"></div>
                       <div className="w-full h-px bg-slate-200 border-t border-dashed border-slate-300"></div>
                       <div className="w-full h-px bg-slate-200 border-t border-dashed border-slate-300"></div>
                     </div>
                  </div>
                </div>
                
                {/* Floating Notifications */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: -20, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 z-20"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-secondary">Nueva Reserva</p>
                    <p className="text-[10px] text-slate-400">Hace 2 min • Cancha 3</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 20, opacity: 1 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="absolute -bottom-6 -left-4 bg-secondary text-white p-3 rounded-xl shadow-xl flex items-center gap-3 z-20"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Ocupación Máxima</p>
                    <p className="text-[10px] text-slate-300">¡Superaste el objetivo!</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8">
              ¿Listo para entrar a la cancha?
            </h2>
            <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-10">
              Únete a la comunidad de pádel más grande de la región y empieza a disfrutar hoy mismo.
            </p>
            <Link 
              to="/registro/seleccion" 
              className="inline-flex items-center gap-3 bg-primary text-secondary-content font-bold text-lg py-4 px-10 rounded-xl hover:bg-primary-hover transition-all shadow-glow hover:scale-105"
            >
              Crear cuenta Gratis
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}