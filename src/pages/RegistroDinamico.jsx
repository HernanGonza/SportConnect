// src/pages/RegistroDinamico.jsx
import React, { useState } from 'react';
import { Button, Input, DatePicker, Select, Radio, Upload, message, Typography, Checkbox, Slider } from 'antd';
import { GoogleOutlined, FacebookOutlined, UserOutlined, MailOutlined, LockOutlined, IdcardOutlined, CalendarOutlined, HomeOutlined, EnvironmentOutlined, PhoneOutlined, PictureOutlined, CheckCircleOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/es_ES';
import { registrarJugadorCompleto } from '../services/authService';
import supabase from '../services/supabaseClient';
import { CATEGORIAS_PADDEL } from '../utils/categorias';
import { PROVINCIAS_ARGENTINAS } from '../utils/provincias';
import styles from './RegistroDinamico.module.css';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;
const { TextArea } = Input;

const CATEGORIAS_CABALLEROS = CATEGORIAS_PADDEL.filter(cat => cat.startsWith('Caballeros'));
const CATEGORIAS_DAMAS = CATEGORIAS_PADDEL.filter(cat => cat.startsWith('Damas'));

// Nuevas constantes para campos pádel
const POSICIONES = ['drive', 'reves', 'ambas'];
const ESTILOS = ['agresivo', 'defensivo', 'tecnico', 'estrategico'];

export default function RegistroDinamico() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: '',
    categoria: '',
    fecha_nacimiento: null,
    direccion: '',
    localidad: '',
    provincia: 'Misiones',
    telefono: '',
    fotoArchivo: null,
    metodo: 'manual',
    nivel_juego: 5,  // Default 5
    posicion_preferida: '',  // Obligatorio
    estilo_juego: '',  // Opcional
  });

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const [dniValid, setDniValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const totalSteps = 17;  // +3 para nuevos campos

  const pasos = [
    { id: 'metodo', title: '¿Cómo querés registrarte?' },
    { id: 'nombre', title: '¿Cuál es tu nombre?' },
    { id: 'apellido', title: '¿Cuál es tu apellido?' },
    { id: 'email', title: '¿Cuál es tu email?' },
    { id: 'password', title: 'Crea una contraseña' },
    { id: 'confirmPassword', title: 'Repite tu contraseña' },
    { id: 'dni', title: 'Ingresa tu DNI' },
    { id: 'fecha_nacimiento', title: '¿Cuál es tu fecha de nacimiento?' },
    { id: 'categoria', title: '¿En qué categoría jugás?' },
    { id: 'nivel_juego', title: '¿Cuál es tu nivel de juego? (1-8)' },
    { id: 'posicion_preferida', title: '¿Posición preferida?' },
    { id: 'estilo_juego', title: '¿Estilo de juego? (opcional)' },
    { id: 'direccion', title: '¿Dónde vivís?' },
    { id: 'localidad', title: '¿En qué localidad?' },
    { id: 'provincia', title: '¿En qué provincia?' },
    { id: 'telefono', title: 'Teléfono (opcional)' },
    { id: 'fotoArchivo', title: 'Subí tu foto de perfil (opcional)' },
    { id: 'resumen', title: '¡Casi listo!' },
  ];

  const currentPaso = pasos[currentStep];

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) message.error('Error con Google');
  };

  const handleFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) message.error('Error con Facebook');
  };

  const validatePassword = (pass) => {
    setPasswordValidations({
      minLength: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      number: /\d/.test(pass),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    });
  };

  const validateDni = (dni) => {
    setDniValid(/^\d{7,8}$/.test(dni));
  };

  const validateEmail = (email) => {
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  };

  const handleChange = (field, value) => {
    let cleanedValue = value;
    if (field === 'telefono') {
      cleanedValue = value.trim();  // Limpia espacios innecesarios
    }
    setFormData(prev => ({ ...prev, [field]: cleanedValue }));

    if (field === 'password') validatePassword(value);
    if (field === 'dni') validateDni(value);
    if (field === 'email') validateEmail(value);
  };

  const handleNext = async () => {
    const pasoActual = currentPaso.id;

    // Campos OBLIGATORIOS (solo estos se validan como requeridos)
    const requiredFields = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      dni: formData.dni,
      fecha_nacimiento: formData.fecha_nacimiento,
      categoria: formData.categoria,
      nivel_juego: formData.nivel_juego,
      posicion_preferida: formData.posicion_preferida,
      direccion: formData.direccion,
      localidad: formData.localidad,
      provincia: formData.provincia,
    };

    // Solo validamos si el paso actual es uno de los obligatorios
    if (requiredFields.hasOwnProperty(pasoActual)) {
      const valor = requiredFields[pasoActual];

      if (
        valor === '' ||
        valor === null ||
        valor === undefined ||
        (typeof valor === 'string' && valor.trim() === '')
      ) {
        message.error(`Por favor completa ${currentPaso.title.toLowerCase()}`);
        return;
      }
    }

    // Validaciones específicas adicionales
    if (pasoActual === 'email' && !emailValid) {
      message.error('Ingresa un email válido');
      return;
    }

    if (pasoActual === 'dni' && !dniValid) {
      message.error('DNI inválido (debe tener 7 u 8 dígitos)');
      return;
    }

    if (pasoActual === 'password' && !Object.values(passwordValidations).every(Boolean)) {
      message.error('La contraseña no cumple con los requisitos');
      return;
    }

    if (pasoActual === 'confirmPassword' && formData.password !== formData.confirmPassword) {
      message.error('Las contraseñas no coinciden');
      return;
    }

    if (pasoActual === 'nivel_juego' && (formData.nivel_juego === null || formData.nivel_juego === undefined)) {
      message.error('Selecciona tu nivel');
      return;
    }

    if (pasoActual === 'posicion_preferida' && !formData.posicion_preferida) {
      message.error('Selecciona una posición');
      return;
    }

    // Flujo de pasos
    if (currentStep === 0) {
      if (formData.metodo === 'manual') {
        setCurrentStep(1);
      }
      return; // No avanza más si es OAuth (se maneja en handleGoogle/handleFacebook)
    }

    if (currentStep === totalSteps) {
      try {
        await registrarJugadorCompleto(
          formData.email,
          formData.password,
          formData.nombre,
          formData.apellido,
          formData.dni,
          formData.fecha_nacimiento?.format('YYYY-MM-DD'),
          formData.direccion,
          formData.localidad,
          formData.provincia,
          formData.telefono || null,
          formData.categoria,
          formData.fotoArchivo,
          formData.nivel_juego,
          formData.posicion_preferida,
          formData.estilo_juego || null
        );
        message.success('¡Registro exitoso!');
        navigate('/panel-usuario', { replace: true });
      } catch (err) {
        message.error(err.message || 'Error al registrarse');
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const renderPasswordValidations = () => (
    <div style={{ marginTop: 8, fontSize: '0.85rem' }}>
      <div><Checkbox checked={passwordValidations.minLength} style={{ color: passwordValidations.minLength ? 'green' : 'red' }}>Mínimo 8 caracteres</Checkbox></div>
      <div><Checkbox checked={passwordValidations.uppercase} style={{ color: passwordValidations.uppercase ? 'green' : 'red' }}>Al menos una mayúscula</Checkbox></div>
      <div><Checkbox checked={passwordValidations.number} style={{ color: passwordValidations.number ? 'green' : 'red' }}>Al menos un número</Checkbox></div>
      <div><Checkbox checked={passwordValidations.specialChar} style={{ color: passwordValidations.specialChar ? 'green' : 'red' }}>Al menos un carácter especial (!@#$%^&*)</Checkbox></div>
    </div>
  );

  const renderPregunta = () => {
    switch (currentPaso.id) {
      case 'metodo':
        return (
          <div className={styles.opcionesLogin}>
            <Button icon={<GoogleOutlined />} block size="large" onClick={handleGoogle}>
              Continuar con Google
            </Button>
            <Button icon={<FacebookOutlined />} block size="large" style={{ marginTop: '12px' }} onClick={handleFacebook}>
              Continuar con Facebook
            </Button>
            <div style={{ margin: '24px 0', textAlign: 'center' }}>
              <Text type="secondary">o</Text>
            </div>
            <Button
              block
              size="large"
              onClick={() => {
                handleChange('metodo', 'manual');
                setCurrentStep(1);
              }}
            >
              Registro manual
            </Button>
          </div>
        );

      case 'nombre':
        return (
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Ej: Juan"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
          />
        );

      case 'apellido':
        return (
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Ej: Pérez"
            value={formData.apellido}
            onChange={(e) => handleChange('apellido', e.target.value)}
          />
        );

      case 'email':
        return (
          <>
            <Input
              size="large"
              prefix={<MailOutlined />}
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <div style={{ marginTop: 8 }}>
              <Checkbox checked={emailValid} style={{ color: emailValid ? 'green' : 'red' }}>
                Email válido
              </Checkbox>
            </div>
          </>
        );

      case 'password':
        return (
          <>
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            {renderPasswordValidations()}
          </>
        );

      case 'confirmPassword':
        return (
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            status={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'error' : ''}
          />
        );

      case 'dni':
        return (
          <>
            <Input
              size="large"
              prefix={<IdcardOutlined />}
              placeholder="12345678"
              value={formData.dni}
              onChange={(e) => handleChange('dni', e.target.value)}
            />
            <div style={{ marginTop: 8 }}>
              <Checkbox checked={dniValid} style={{ color: dniValid ? 'green' : 'red' }}>
                DNI válido (7-8 dígitos)
              </Checkbox>
            </div>
          </>
        );

      case 'fecha_nacimiento':
        return (
          <DatePicker
            size="large"
            style={{ width: '100%' }}
            locale={locale}
            format="DD/MM/YYYY"
            placeholder="Selecciona una fecha"
            value={formData.fecha_nacimiento}
            onChange={(date) => handleChange('fecha_nacimiento', date)}
          />
        );

      case 'categoria':
        return (
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <Text strong>Caballeros</Text>
              <Radio.Group
                value={formData.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}
              >
                {CATEGORIAS_CABALLEROS.map(cat => (
                  <Radio key={cat} value={cat}>
                    {cat.replace('Caballeros ', '')}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
            <div style={{ flex: 1 }}>
              <Text strong>Damas</Text>
              <Radio.Group
                value={formData.categoria}
                onChange={(e) => handleChange('categoria', e.target.value)}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}
              >
                {CATEGORIAS_DAMAS.map(cat => (
                  <Radio key={cat} value={cat}>
                    {cat.replace('Damas ', '')}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>
        );

      case 'nivel_juego':
        return (
          <Slider
            min={1}
            max={8}
            marks={{ 1: '1 (Principiante)', 8: '8 (Pro)' }}
            value={formData.nivel_juego}
            onChange={(value) => handleChange('nivel_juego', value)}
          />
        );

      case 'posicion_preferida':
        return (
          <Radio.Group
            value={formData.posicion_preferida}
            onChange={(e) => handleChange('posicion_preferida', e.target.value)}
          >
            {POSICIONES.map(pos => (
              <Radio key={pos} value={pos}>
                {pos.charAt(0).toUpperCase() + pos.slice(1)}
              </Radio>
            ))}
          </Radio.Group>
        );

      case 'estilo_juego':
        return (
          <Select
            size="large"
            style={{ width: '100%' }}
            placeholder="Selecciona (opcional)"
            value={formData.estilo_juego}
            onChange={(value) => handleChange('estilo_juego', value)}
            allowClear
          >
            {ESTILOS.map(est => (
              <Select.Option key={est} value={est}>
                {est.charAt(0).toUpperCase() + est.slice(1)}
              </Select.Option>
            ))}
          </Select>
        );

      case 'direccion':
        return (
          <TextArea
            size="large"
            prefix={<HomeOutlined />}
            placeholder="Calle 123"
            rows={2}
            value={formData.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
          />
        );

      case 'localidad':
        return (
          <Input
            size="large"
            prefix={<EnvironmentOutlined />}
            placeholder="Posadas"
            value={formData.localidad}
            onChange={(e) => handleChange('localidad', e.target.value)}
          />
        );

      case 'provincia':
        return (
          <Select
            size="large"
            style={{ width: '100%' }}
            defaultValue="Misiones"
            onChange={(value) => handleChange('provincia', value)}
          >
            {PROVINCIAS_ARGENTINAS.map(p => (
              <Select.Option key={p} value={p}>
                {p}
              </Select.Option>
            ))}
          </Select>
        );

      case 'telefono':
        return (
          <Input
            size="large"
            prefix={<PhoneOutlined />}
            placeholder="3764123456"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
          />
        );

      case 'fotoArchivo':
        return (
          <Upload.Dragger
            beforeUpload={(file) => {
              handleChange('fotoArchivo', file);
              return false;
            }}
            showUploadList={false}
            accept="image/*"
          >
            {formData.fotoArchivo ? (
              <div>
                <img
                  src={URL.createObjectURL(formData.fotoArchivo)}
                  alt="Vista previa"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div>
                <PictureOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                <div style={{ marginTop: 8 }}>Haz clic o arrastra una imagen</div>
                <Text type="secondary">JPG, PNG o WEBP</Text>
              </div>
            )}
          </Upload.Dragger>
        );

      case 'resumen':
        return (
          <div className={styles.resumen}>
            <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
            <Text strong>¡Casi listo!</Text>
            <div style={{ textAlign: 'left', marginTop: '24px', fontSize: '0.95rem' }}>
              <p><strong>Nombre:</strong> {formData.nombre} {formData.apellido}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>DNI:</strong> {formData.dni}</p>
              <p><strong>Categoría:</strong> {formData.categoria}</p>
              <p><strong>Nivel:</strong> {formData.nivel_juego}</p>
              <p><strong>Posición:</strong> {formData.posicion_preferida}</p>
              {formData.estilo_juego && <p><strong>Estilo:</strong> {formData.estilo_juego}</p>}
              <p><strong>Localidad:</strong> {formData.localidad}, {formData.provincia}</p>
              {formData.telefono && <p><strong>Teléfono:</strong> {formData.telefono}</p>}
              {formData.fotoArchivo && <p><strong>Foto:</strong> Seleccionada</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (formData.metodo !== 'manual' && currentStep === 0) {
    return (
      <div className={styles.contenedor}>
        <div className={styles.tarjeta}>
          <div className={styles.progreso}>Registro con {formData.metodo === 'google' ? 'Google' : 'Facebook'}</div>
          <h2>Redirigiendo...</h2>
          <Text>Espere un momento.</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contenedor}>
      <div className={styles.tarjeta}>
        <div className={styles.progreso}>
          Paso {currentStep}/{totalSteps}
        </div>

        <h2>{currentPaso.title}</h2>

        <div className={styles.pregunta}>
          {renderPregunta()}
        </div>

        <div className={styles.botones}>
          {currentStep > 0 && (
            <Button onClick={handleBack} style={{ marginRight: '12px' }}>
              Atrás
            </Button>
          )}
          <Button
            type="primary"
            onClick={handleNext}
          >
            {currentStep === totalSteps ? 'Confirmar registro' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  );
}