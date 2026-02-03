import React from 'react';
import { ShoppingCart, Package, Plus, Search, AlertCircle } from 'lucide-react';

export default function StockView({ clubId }) {
  // Mock data
  const productos = [
    { id: 1, nombre: 'Paleta Bullpadel Hack 03', categoria: 'Equipamiento', stock: 4, precio: 320000, estado: 'ok' },
    { id: 2, nombre: 'Tubo Pelotas Wilson x3', categoria: 'Consumibles', stock: 12, precio: 15000, estado: 'low' },
    { id: 3, nombre: 'Gatorade 500ml', categoria: 'Bebidas', stock: 45, precio: 2500, estado: 'ok' },
    { id: 4, nombre: 'Agua Mineral 500ml', categoria: 'Bebidas', stock: 8, precio: 1500, estado: 'critical' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-slate-900">Stock / Tienda</h2>
          <p className="text-slate-500">Control de inventario y productos.</p>
        </div>
        <button className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
        <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 rounded-xl border border-slate-200">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="flex-1 bg-transparent py-3 outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <select className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600 font-medium">
          <option>Todas las categorías</option>
          <option>Equipamiento</option>
          <option>Bebidas</option>
        </select>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productos.map((prod) => (
          <div key={prod.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative">
            <div className="absolute top-4 right-4">
               {prod.estado === 'low' && <span className="w-3 h-3 bg-orange-500 rounded-full block ring-4 ring-orange-100" title="Stock bajo"></span>}
               {prod.estado === 'critical' && <span className="w-3 h-3 bg-red-500 rounded-full block ring-4 ring-red-100 animate-pulse" title="Stock crítico"></span>}
            </div>

            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400 group-hover:bg-primary/20 group-hover:text-slate-900 transition-colors">
              <Package size={24} />
            </div>
            
            <h3 className="font-bold text-slate-900 mb-1 truncate">{prod.nombre}</h3>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wide mb-4">{prod.categoria}</p>
            
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Precio</p>
                <p className="font-bold text-slate-900">${prod.precio.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Stock</p>
                <p className={`font-bold ${prod.stock < 10 ? 'text-red-500' : 'text-slate-900'}`}>{prod.stock} u.</p>
              </div>
            </div>
          </div>
        ))}

        {/* Card de Agregar Rápido */}
        <button className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all min-h-[180px]">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Plus size={24} />
          </div>
          <span className="font-bold">Agregar rápido</span>
        </button>
      </div>

      {/* Alertas de Stock */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="text-orange-500 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-orange-800">Alertas de Stock</h4>
          <p className="text-sm text-orange-700 mt-1">
            Tienes <strong>2 productos</strong> con stock bajo o crítico. Revisa el inventario para reponer.
          </p>
        </div>
      </div>
    </div>
  );
}
