import React from 'react';
import { Settings, User, Bell, Shield, Smartphone, CreditCard, Save } from 'lucide-react';

export default function ConfiguracionClubView({ clubId }) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-heading font-bold text-slate-900">Configuración</h2>
        <p className="text-slate-500">Administra los ajustes generales de tu club.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar de Configuración */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm font-bold text-slate-900 flex items-center gap-3 ring-2 ring-primary/20">
            <User size={18} /> Perfil del Club
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 font-medium flex items-center gap-3 transition-all">
            <Bell size={18} /> Notificaciones
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 font-medium flex items-center gap-3 transition-all">
            <CreditCard size={18} /> Pagos y Facturación
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 font-medium flex items-center gap-3 transition-all">
            <Shield size={18} /> Seguridad
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 font-medium flex items-center gap-3 transition-all">
            <Smartphone size={18} /> Integraciones
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Información General</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nombre del Club</label>
                  <input type="text" defaultValue="Padel Center Demo" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Teléfono</label>
                  <input type="tel" defaultValue="3764 123456" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Dirección</label>
                <input type="text" defaultValue="Av. Costanera 1234" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Descripción</label>
                <textarea rows="4" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary resize-none" defaultValue="El mejor complejo de padel de la ciudad..."></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                  <Save size={18} /> Guardar Cambios
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Horarios de Atención</h3>
            <div className="space-y-4">
               {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => (
                 <div key={dia} className="flex items-center justify-between">
                   <span className="font-medium text-slate-700 w-24">{dia}</span>
                   <div className="flex gap-2">
                     <input type="time" defaultValue="08:00" className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm" />
                     <span className="text-slate-400 self-center">-</span>
                     <input type="time" defaultValue="23:30" className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm" />
                   </div>
                   <label className="flex items-center gap-2 cursor-pointer">
                     <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
                     <span className="text-sm text-slate-500">Abierto</span>
                   </label>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
