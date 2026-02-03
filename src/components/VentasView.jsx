import React from 'react';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';

export default function VentasView({ clubId }) {
  // Mock data
  const transacciones = [
    { id: 1, concepto: 'Reserva Cancha 1 - Juan Pérez', monto: 22000, hora: '10:30', metodo: 'Efectivo' },
    { id: 2, concepto: 'Alquiler Paletas (2)', monto: 4000, hora: '10:35', metodo: 'MP' },
    { id: 3, concepto: 'Bebidas - Mesa 4', monto: 6500, hora: '11:15', metodo: 'Efectivo' },
    { id: 4, concepto: 'Reserva Cancha 2 - Torneo', monto: 18000, hora: '12:00', metodo: 'MP' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-slate-900">Ventas del día</h2>
          <p className="text-slate-500">Resumen de ingresos y caja diaria.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 shadow-sm">
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-3xl border border-green-100 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-green-200/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-green-700 font-bold">
              <DollarSign size={20} /> Total Ingresos
            </div>
            <p className="text-4xl font-bold text-slate-900">$125.400</p>
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp size={14} /> +12% vs ayer
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-500 font-bold">
            <CreditCard size={20} /> Mercado Pago
          </div>
          <p className="text-3xl font-bold text-slate-900">$85.000</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-500 h-full w-[65%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-500 font-bold">
            <DollarSign size={20} /> Efectivo
          </div>
          <p className="text-3xl font-bold text-slate-900">$40.400</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-green-500 h-full w-[35%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Tabla de Transacciones */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">Últimos movimientos</h3>
          <button className="text-primary text-sm font-bold hover:underline">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 text-left">Hora</th>
                <th className="px-6 py-4 text-left">Concepto</th>
                <th className="px-6 py-4 text-left">Método</th>
                <th className="px-6 py-4 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transacciones.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500 text-sm">{tx.hora}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{tx.concepto}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      tx.metodo === 'MP' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {tx.metodo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    ${tx.monto.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
