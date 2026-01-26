// src/pages/AuthCallback.jsx
import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import supabase from '../services/supabaseClient';
import { message } from 'antd';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: perfil, error } = await supabase
          .from('usuarios')
          .select('tipo')
          .eq('id', session.user.id)
          .single();

        if (error || !perfil) {
          message.error('Error al cargar perfil');
          navigate('/login');
          return;
        }

        if (perfil.tipo === 'club') {
          navigate('/panel-club', { replace: true });
        } else if (perfil.tipo === 'empleado') {
          navigate('/panel-empleado', { replace: true });
        } else {
          navigate('/panel-usuario', { replace: true });  // ← JUGADOR
        }
      } else {
        message.error('Error al iniciar sesión');
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
  );
}