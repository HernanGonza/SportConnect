import React from 'react';
import { Gift, Percent, Calendar, Plus, Tag } from 'lucide-react';

export default function PromocionesView({ clubId }) {
  const promociones = [
    { 
      id: 1, 
      titulo: 'Happy Hour Mañanero', 
      descuento: '20% OFF', 
      dias: 'Lun a Vie', 
      horario: '08:00 - 12:00', 
      estado: 'activa',
      color: 'bg-yellow-100 text-yellow-700'
    },
    { 
      id: 2, 
      titulo: 'Pack 4 Partidos', 
      descuento: '1 Partido Gratis', 
      dias: 'Todos los días', 
      horario: 'Todo el día', 
      estado: 'activa',
      color: 'bg-green-100 text-green-700'
    },
    { 
      id: 3, 
      titulo: 'Torneo Fin de Mes', 
      descuento: 'Inscripción 2x1', 
      dias: 'Sáb 28/02', 
      horario: '14:00', 
      estado: 'programada',
      color: 'bg-purple-100 text-purple-700'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-slate-900">Promociones</h2>
          <p className="text-slate-500">Gestiona descuentos y ofertas especiales.</p>
        </div>
        <button className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
          <Plus size={20} /> Nueva Promo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {promociones.map((promo) => (
          <div key={promo.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl text-xs font-bold uppercase tracking-wider ${promo.estado === 'activa' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {promo.estado}
            </div>
            
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${promo.color}`}>
                <Percent size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{promo.titulo}</h3>
                <p className="text-2xl font-black text-primary drop-shadow-sm mb-3">{promo.descuento}</p>
                
                <div className="flex flex-wrap gap-3 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} /> {promo.dias}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag size={16} /> {promo.horario}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
              <button className="flex-1 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                Editar
              </button>
              <button className="flex-1 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                Pausar
              </button>
            </div>
          </div>
        ))}

        {/* Crear Promo Placeholder */}
        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-slate-400 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[200px]">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
            <Gift size={32} />
          </div>
          <h3 className="font-bold text-slate-600 text-lg">Crear nueva promoción</h3>
          <p className="text-sm mt-2 max-w-xs">Configura descuentos automáticos por horario, día o categoría de usuario.</p>
        </div>
      </div>
    </div>
  );
}
