import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { message } from 'antd';
import { iniciarSesion } from '../services/authService';
import supabase from '../services/supabaseClient';
import heroBg from '../assets/images/img-padel.jpeg';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { tipo } = await iniciarSesion(formData.email, formData.password);
      message.success('¡Bienvenido de vuelta!');

      if (tipo === 'club') {
        navigate('/panel-club', { replace: true });
      } else if (tipo === 'empleado') {
        navigate('/panel-empleado', { replace: true });
      } else {
        navigate('/panel-usuario', { replace: true });
      }
    } catch (err) {
      message.error(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (error) {
      message.error(`Error con ${provider}: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Login Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent"></div>
        </div>
        <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center font-bold text-secondary text-xl">S</div>
            <span className="text-2xl font-heading font-bold">SportConnect</span>
          </Link>
          
          <div className="max-w-md">
            <h1 className="text-5xl font-heading font-bold mb-6 leading-tight text-white drop-shadow-md">
              Tu juego, <br/>
              <span className="text-primary drop-shadow-none">Tu control.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Accede a la plataforma más completa para gestionar tus reservas, unirte a torneos y conectar con la comunidad.
            </p>
          </div>

          <div className="text-sm text-slate-400">
            © 2026 SportConnect. Todos los derechos reservados.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2 justify-center">
              <div className="w-10 h-10 rounded bg-primary flex items-center justify-center font-bold text-secondary text-xl">S</div>
              <span className="text-2xl font-heading font-bold text-secondary">SportConnect</span>
            </Link>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading font-bold text-secondary mb-2">¡Hola de nuevo!</h2>
            <p className="text-slate-500">Ingresa tus credenciales para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50 hover:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Contraseña</label>
                <a href="#" className="text-xs font-medium text-primary hover:text-primary-hover hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                  type="password" 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-slate-50 hover:bg-white"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-secondary text-white font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-slate-400 text-sm font-medium">O continúa con</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
            <button 
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700"
            >
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
              Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-slate-500">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro/seleccion" className="text-primary font-bold hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}