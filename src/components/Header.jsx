// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import supabase from '../services/supabaseClient';
import { User, LogOut, Menu, X } from 'lucide-react';

export default function Header() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cargarPerfil = async (userId) => {
    const { data } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, foto_perfil_url, tipo')
      .eq('id', userId)
      .maybeSingle();

    setUsuario(data);
    setLoading(false);
  };

  useEffect(() => {
    const cargarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        cargarPerfil(session.user.id);
      } else {
        setUsuario(null);
        setLoading(false);
      }
    };

    cargarSesion();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        cargarPerfil(session.user.id);
      } else {
        setUsuario(null);
      }
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    navigate('/');
  };

  const nombreMostrar = usuario?.tipo === 'club' 
    ? usuario.nombre 
    : `${usuario?.nombre || ''} ${usuario?.apellido || ''}`.trim() || 'Usuario';

  const panelLink = usuario ? (usuario.tipo === 'club' ? '/panel-club' : '/panel-usuario') : '/';

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-secondary/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-secondary group-hover:scale-110 transition-transform">
            S
          </div>
          <span className="text-xl font-heading font-bold text-white tracking-tight">
            SportConnect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {!usuario ? (
            <>
              <a href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">Beneficios</a>
              <a href="#how" className="text-slate-300 hover:text-white transition-colors font-medium">Cómo funciona</a>
              <a href="#clubes" className="text-slate-300 hover:text-white transition-colors font-medium">Para Clubes</a>
              <div className="flex items-center gap-4 ml-4">
                <Link to="/login" className="text-white font-medium hover:text-primary transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/registro/seleccion" className="btn-primary text-sm py-2 px-5">
                  Registrarse
                </Link>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to={panelLink} className="text-slate-300 hover:text-white transition-colors">
                Mi Panel
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 border border-white/20">
                   {usuario.foto_perfil_url ? (
                     <img src={usuario.foto_perfil_url} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                       {nombreMostrar[0]}
                     </div>
                   )}
                </div>
                <span className="text-sm font-medium text-white hidden lg:block">{nombreMostrar}</span>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-white/10 absolute w-full left-0 px-6 py-4 flex flex-col gap-4 shadow-xl">
           {!usuario ? (
            <>
              <a href="#features" className="text-slate-300 py-2 block">Beneficios</a>
              <a href="#how" className="text-slate-300 py-2 block">Cómo funciona</a>
              <hr className="border-white/10" />
              <Link to="/login" className="text-white font-medium py-2 block">
                Iniciar sesión
              </Link>
              <Link to="/registro/seleccion" className="btn-primary text-center block w-full">
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 py-2">
                 <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                   {nombreMostrar[0]}
                 </div>
                 <span className="text-white font-medium">{nombreMostrar}</span>
              </div>
              <Link to={logoLink} className="text-slate-300 py-2 block">Ir a Mi Panel</Link>
              <button 
                onClick={handleLogout}
                className="text-red-400 py-2 block w-full text-left"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}