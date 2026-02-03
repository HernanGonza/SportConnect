// src/pages/PanelEmpleado.jsx
import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import Sidebar from '../components/Sidebar';
import supabase from '../services/supabaseClient';

export default function PanelEmpleado() {
  const [club, setClub] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        message.error('No estás logueado');
        setLoading(false);
        return;
      }

      // Cargar empleado
      const { data: empData, error: empError } = await supabase
        .from('empleados_club')
        .select('*')
        .eq('user_id', user.id);

      if (empError || !empData || empData.length === 0) {
        message.error('No se encontró tu perfil de empleado. Contacta al dueño del club.');
        setLoading(false);
        return;
      }

      const empleadoActual = empData[0];
      setEmpleado(empleadoActual);

      // Cargar club
      const { data: clubData, error: clubError } = await supabase
        .from('clubes')
        .select('*')
        .eq('id', empleadoActual.club_id);

      if (clubError || !clubData || clubData.length === 0) {
        message.error('No se encontró el club asociado');
        setLoading(false);
        return;
      }

      setClub(clubData[0]);
      setLoading(false);
    };

    cargarDatos();
  }, []);

  if (loading) return <Spin spinning fullscreen />;

  if (!club || !empleado) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
        <h2>Error al cargar el panel del empleado</h2>
        <p>No se encontró tu perfil. Verificá con el dueño del club.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        userType="empleado" 
        userName={empleado?.nombre || 'Empleado'} 
        userPhoto={null}
      />
      
      <main className="flex-1 lg:pl-72 min-h-screen transition-all duration-300">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Bienvenido, {empleado?.nombre}</h1>
          <h2 className="text-xl text-slate-500 mb-6">Club: {club?.nombre}</h2>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
             <p className="text-lg"><strong>Rol:</strong> <span className="capitalize">{empleado?.rol}</span></p>
             <p className="text-slate-500 mt-2">Desde aquí puedes gestionar reservas, caja diaria, stock y más herramientas del club.</p>
          </div>
          
          {/* Dashboard Cards or quick actions could go here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-bold text-lg mb-2">Reservas</h3>
                <p className="text-sm text-slate-500">Gestionar turnos y canchas.</p>
             </div>
             <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-bold text-lg mb-2">Caja</h3>
                <p className="text-sm text-slate-500">Ver movimientos del día.</p>
             </div>
             <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-bold text-lg mb-2">Stock</h3>
                <p className="text-sm text-slate-500">Control de inventario.</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}