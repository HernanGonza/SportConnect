// src/pages/SeleccionTipoRegistro.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building2, ArrowLeft } from 'lucide-react';

export default function SeleccionTipoRegistro() {
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
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-secondary skew-y-6 transform -translate-y-24 z-0"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0"></div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="mb-12 text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-secondary transition-colors mb-8">
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-4"
          >
            ¿Cómo querés registrarte?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-xl"
          >
            Elegí el tipo de cuenta que mejor se adapta a vos
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Opción Jugador */}
          <motion.div variants={itemVariants}>
            <Link to="/registro/jugador" className="group block h-full">
              <div className="bg-white rounded-3xl p-8 h-full shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 relative overflow-hidden group-hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-primary/20 transition-all"></div>
                
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <User size={40} className="text-secondary group-hover:text-primary transition-colors" />
                </div>
                
                <h2 className="text-3xl font-heading font-bold text-secondary mb-4 group-hover:text-primary transition-colors">
                  Soy Jugador
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-8">
                  Reservá canchas en segundos, uníte a partidos abiertos, participá en torneos y llevá tu historial de juego.
                </p>
                
                <span className="inline-flex items-center font-bold text-secondary group-hover:translate-x-2 transition-transform">
                  Crear cuenta de Jugador
                  <ArrowLeft className="ml-2 rotate-180" size={20} />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Opción Club */}
          <motion.div variants={itemVariants}>
            <Link to="/registro/club" className="group block h-full">
              <div className="bg-white rounded-3xl p-8 h-full shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 relative overflow-hidden group-hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-secondary/10 transition-all"></div>
                
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Building2 size={40} className="text-secondary" />
                </div>
                
                <h2 className="text-3xl font-heading font-bold text-secondary mb-4">
                  Represento un Club
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-8">
                  Gestioná tus canchas y reservas, controlá el stock de tu cantina, organizá torneos y aumentá tu visibilidad.
                </p>
                
                <span className="inline-flex items-center font-bold text-secondary group-hover:translate-x-2 transition-transform">
                  Registrar mi Club
                  <ArrowLeft className="ml-2 rotate-180" size={20} />
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}