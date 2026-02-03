import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Trophy, Edit2, Camera, Save, LogOut } from 'lucide-react';
import { message } from 'antd';
import Sidebar from '../components/Sidebar';
import supabase from '../services/supabaseClient';
import { cerrarSesion } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function PerfilUsuario() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    categoria: '',
    foto_url: null
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // MOCK DATA
      if (!authUser) {
        setUser({
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@demo.com',
          telefono: '3764 123456',
          direccion: 'Av. Corrientes 1234, Posadas',
          categoria: '3ra Caballeros',
          foto_url: null
        });
        setLoading(false);
        return;
      }

      // Real Data
      const { data: profile, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser(profile);
      } else if (authUser) {
        // Fallback si no hay perfil en tabla usuarios pero si auth
        setUser({
          nombre: authUser.user_metadata.nombre || '',
          apellido: authUser.user_metadata.apellido || '',
          email: authUser.email,
          ...profile
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await cerrarSesion();
    navigate('/');
  };

  const handleSave = async () => {
    // Aquí iría la lógica de guardado en Supabase
    message.success('Perfil actualizado correctamente');
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userType="jugador" userName={user.nombre} />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-heading font-bold text-secondary">Mi Perfil</h1>
              <p className="text-slate-500 mt-1">Gestiona tu información personal y preferencias.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="md:hidden flex items-center gap-2 text-red-500 font-bold bg-red-50 px-4 py-2 rounded-xl"
            >
              <LogOut size={18} /> Salir
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tarjeta de Perfil */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-1"
            >
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-secondary to-slate-800"></div>
                
                <div className="relative mt-8 mb-4 group cursor-pointer">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 shadow-lg overflow-hidden">
                    {user.foto_url ? (
                      <img src={user.foto_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400">
                        {user.nombre?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 p-2 bg-primary text-secondary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={16} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-secondary">{user.nombre} {user.apellido}</h2>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-secondary rounded-full text-sm font-bold">
                  <Trophy size={14} />
                  {user.categoria || 'Amateur'}
                </div>
              </div>
            </motion.div>

            {/* Formulario de Datos */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-secondary">Información Personal</h3>
                  <button 
                    onClick={() => editing ? handleSave() : setEditing(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                      editing 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {editing ? <><Save size={18} /> Guardar</> : <><Edit2 size={18} /> Editar</>}
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <User size={16} /> Nombre
                      </label>
                      <input 
                        type="text" 
                        value={user.nombre} 
                        disabled={!editing}
                        className={`w-full p-3 rounded-xl border outline-none transition-all ${editing ? 'border-primary bg-white ring-2 ring-primary/10' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <User size={16} /> Apellido
                      </label>
                      <input 
                        type="text" 
                        value={user.apellido} 
                        disabled={!editing}
                        className={`w-full p-3 rounded-xl border outline-none transition-all ${editing ? 'border-primary bg-white ring-2 ring-primary/10' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
                      <Mail size={16} /> Email
                    </label>
                    <input 
                      type="email" 
                      value={user.email} 
                      disabled
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <Phone size={16} /> Teléfono
                      </label>
                      <input 
                        type="tel" 
                        value={user.telefono} 
                        disabled={!editing}
                        className={`w-full p-3 rounded-xl border outline-none transition-all ${editing ? 'border-primary bg-white ring-2 ring-primary/10' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <MapPin size={16} /> Dirección
                      </label>
                      <input 
                        type="text" 
                        value={user.direccion} 
                        disabled={!editing}
                        className={`w-full p-3 rounded-xl border outline-none transition-all ${editing ? 'border-primary bg-white ring-2 ring-primary/10' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
