// src/pages/Login.jsx
import React from 'react';
import { Form, Input, Button, Divider, message } from 'antd';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../services/authService';
import supabase from '../services/supabaseClient';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { tipo } = await iniciarSesion(values.email, values.password);

      message.success('¡Bienvenido de vuelta!');

      if (tipo === 'club') {
        navigate('/panel-club', { replace: true });
      } else if (tipo === 'empleado') {
        navigate('/panel-empleado', { replace: true });
      } else {
        navigate('/panel-usuario', { replace: true });  // ← JUGADOR
      }
    } catch (err) {
      message.error(err.message || 'Error al iniciar sesión');
    }
  };

  const handleSocialLogin = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className={styles.container}>
      <h2>Iniciar Sesión</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="juan@ejemplo.com" />
        </Form.Item>
        <Form.Item label="Contraseña" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>

      <Divider>o</Divider>

      <Button icon={<GoogleOutlined />} block size="large" onClick={() => handleSocialLogin('google')} style={{ marginBottom: 12 }}>
        Continuar con Google
      </Button>
      <Button icon={<FacebookOutlined />} block size="large" onClick={() => handleSocialLogin('facebook')}>
        Continuar con Facebook
      </Button>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        ¿No tenés cuenta? <Link to="/registro/seleccion">Registrarse</Link>
      </div>
    </div>
  );
}