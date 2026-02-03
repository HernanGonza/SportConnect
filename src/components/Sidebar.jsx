// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Calendar, User, LayoutDashboard, Users, Table2, 
  DollarSign, ShoppingCart, Gift, Settings, LogOut, Menu, X 
} from 'lucide-react';
import { cerrarSesion } from '../services/authService';

const Sidebar = ({ userType = 'jugador', userName = 'Usuario', userPhoto, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await cerrarSesion();
    navigate('/');
  };

  const menuItems = {
    jugador: [
      { key: 'home', icon: Home, label: 'Inicio', path: '/panel-usuario' },
      { key: 'reservas', icon: Calendar, label: 'Mis Reservas', path: '/mis-reservas' },
      { key: 'perfil', icon: User, label: 'Mi Perfil', path: '/perfil' },
    ],
    club: [
      { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/panel-club' },
      { key: 'empleados', icon: Users, label: 'Empleados', path: '/panel-club/empleados' },
      { key: 'canchas', icon: Table2, label: 'Canchas', path: '/panel-club/canchas' },
      { key: 'reservas', icon: Calendar, label: 'Reservas', path: '/panel-club/reservas' },
      { key: 'ventas', icon: DollarSign, label: 'Ventas del día', path: '/panel-club/ventas' },
      { key: 'stock', icon: ShoppingCart, label: 'Stock / Tienda', path: '/panel-club/stock' },
      { key: 'promociones', icon: Gift, label: 'Promociones', path: '/panel-club/promociones' },
    ],
    empleado: [
      { key: 'reservas', icon: Calendar, label: 'Reservas', path: '/panel-empleado/reservas' },
      { key: 'caja', icon: DollarSign, label: 'Caja', path: '/panel-empleado/caja' },
      { key: 'stock', icon: ShoppingCart, label: 'Stock', path: '/panel-empleado/stock' },
    ],
  };

  const items = menuItems[userType] || menuItems.jugador;
  const configItem = userType === 'club' ? { key: 'config', icon: Settings, label: 'Configuración', path: '/panel-club/configuracion' } : null;

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path || (item.path !== '/panel-club' && location.pathname.startsWith(item.path));
    const Icon = item.icon;
    
    return (
      <Link
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group mb-1
          ${isActive 
            ? 'bg-[#DFFF00] text-slate-900 shadow-[0_0_20px_rgba(223,255,0,0.3)] font-bold' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
          }
        `}
      >
        <Icon size={20} className={isActive ? 'text-slate-900' : 'group-hover:text-[#DFFF00] transition-colors'} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#0f172a] text-white rounded-lg shadow-lg lg:hidden border border-white/10"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-72 bg-[#0f172a] text-white transition-transform duration-300 ease-in-out
        flex flex-col border-r border-white/5 shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${className || ''}
      `}>
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DFFF00] flex items-center justify-center shadow-[0_0_15px_rgba(223,255,0,0.4)]">
              <span className="font-black text-slate-900 text-xl">SC</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg leading-tight text-white tracking-wide">SportConnect</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Panel {userType}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          {items.map((item) => (
            <NavItem key={item.key} item={item} />
          ))}

          {/* Separator for Config if exists */}
          {configItem && (
            <div className="mt-8 pt-4 border-t border-white/5">
               <div className="bg-[#1e293b] rounded-xl p-1">
                 <NavItem item={configItem} />
               </div>
            </div>
          )}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 bg-black/20 backdrop-blur-sm border-t border-white/5">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#DFFF00]/50 bg-slate-800">
              {userPhoto ? (
                <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold bg-slate-700">
                  {userName ? userName[0]?.toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{userName}</p>
              <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-[#DFFF00] transition-colors flex items-center gap-1 mt-0.5">
                <LogOut size={12} /> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;