import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, CreditCard, Calendar, MapPin, Phone, Camera, CheckCircle, ArrowRight, ArrowLeft, UploadCloud 
} from 'lucide-react';
import { message } from 'antd';
import { registrarJugadorCompleto } from '../services/authService';
import supabase from '../services/supabaseClient';
import { CATEGORIAS_PADDEL } from '../utils/categorias';
import { PROVINCIAS_ARGENTINAS } from '../utils/provincias';

const CATEGORIAS_CABALLEROS = CATEGORIAS_PADDEL.filter(cat => cat.startsWith('Caballeros'));
const CATEGORIAS_DAMAS = CATEGORIAS_PADDEL.filter(cat => cat.startsWith('Damas'));

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
    fecha_nacimiento: '',
    direccion: '',
    localidad: '',
    provincia: 'Misiones',
    telefono: '',
    fotoArchivo: null,
    metodo: 'manual',
  });

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const [dniValid, setDniValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const totalSteps = 14;

  const pasos = [
    { id: 'metodo', title: '¿Cómo querés registrarte?', icon: User },
    { id: 'nombre', title: '¿Cuál es tu nombre?', icon: User },
    { id: 'apellido', title: '¿Cuál es tu apellido?', icon: User },
    { id: 'email', title: '¿Cuál es tu email?', icon: Mail },
    { id: 'password', title: 'Crea una contraseña', icon: Lock },
    { id: 'confirmPassword', title: 'Repite tu contraseña', icon: Lock },
    { id: 'dni', title: 'Ingresa tu DNI', icon: CreditCard },
    { id: 'fecha_nacimiento', title: 'Fecha de nacimiento', icon: Calendar },
    { id: 'categoria', title: '¿En qué categoría jugás?', icon: CheckCircle },
    { id: 'direccion', title: '¿Dónde vivís?', icon: MapPin },
    { id: 'localidad', title: '¿En qué localidad?', icon: MapPin },
    { id: 'provincia', title: '¿En qué provincia?', icon: MapPin },
    { id: 'telefono', title: 'Teléfono (opcional)', icon: Phone },
    { id: 'fotoArchivo', title: 'Foto de perfil (opcional)', icon: Camera },
    { id: 'resumen', title: '¡Casi listo!', icon: CheckCircle },
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
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'password') validatePassword(value);
    if (field === 'dni') validateDni(value);
    if (field === 'email') validateEmail(value);
  };

  const handleNext = async () => {
    const pasoActual = currentPaso.id;

    // Validación básica de campo vacío
    const requiredFields = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      dni: formData.dni,
      fecha_nacimiento: formData.fecha_nacimiento,
      categoria: formData.categoria,
      direccion: formData.direccion,
      localidad: formData.localidad,
      provincia: formData.provincia,
    };

    if (requiredFields[pasoActual] === '' || requiredFields[pasoActual] === null || requiredFields[pasoActual] === undefined) {
      message.error(`Por favor completa ${currentPaso.title.toLowerCase()}`);
      return;
    }

    // Validaciones específicas
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

    if (currentStep === 0) {
      if (formData.metodo === 'manual') {
        setCurrentStep(1);
      }
    } else if (currentStep === totalSteps) {
      try {
        await registrarJugadorCompleto(
          formData.email,
          formData.password,
          formData.nombre,
          formData.apellido,
          formData.dni,
          formData.fecha_nacimiento, // Ya es string YYYY-MM-DD
          formData.direccion,
          formData.localidad,
          formData.provincia,
          formData.telefono || null,
          formData.categoria,
          formData.fotoArchivo
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
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/registro/seleccion');
    }
  };

  const renderPasswordValidations = () => (
    <div className="mt-3 grid grid-cols-1 gap-1 text-sm">
      <div className={`flex items-center gap-2 ${passwordValidations.minLength ? 'text-green-600' : 'text-slate-400'}`}>
        <CheckCircle size={14} /> Mínimo 8 caracteres
      </div>
      <div className={`flex items-center gap-2 ${passwordValidations.uppercase ? 'text-green-600' : 'text-slate-400'}`}>
        <CheckCircle size={14} /> Al menos una mayúscula
      </div>
      <div className={`flex items-center gap-2 ${passwordValidations.number ? 'text-green-600' : 'text-slate-400'}`}>
        <CheckCircle size={14} /> Al menos un número
      </div>
      <div className={`flex items-center gap-2 ${passwordValidations.specialChar ? 'text-green-600' : 'text-slate-400'}`}>
        <CheckCircle size={14} /> Al menos un carácter especial (!@#$%^&*)
      </div>
    </div>
  );

  const renderPregunta = () => {
    switch (currentPaso.id) {
      case 'metodo':
        return (
          <div className="space-y-4">
            <button 
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700 bg-white"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continuar con Google
            </button>
            <button 
              onClick={handleFacebook}
              className="w-full flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700 bg-white"
            >
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
              Continuar con Facebook
            </button>
            
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-slate-400 text-sm font-medium">o</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <button
              onClick={() => {
                handleChange('metodo', 'manual');
                setCurrentStep(1);
              }}
              className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2"
            >
              Registro manual
            </button>
          </div>
        );

      case 'nombre':
        return (
          <input
            type="text"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Ej: Juan"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            autoFocus
          />
        );

      case 'apellido':
        return (
          <input
            type="text"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Ej: Pérez"
            value={formData.apellido}
            onChange={(e) => handleChange('apellido', e.target.value)}
            autoFocus
          />
        );

      case 'email':
        return (
          <div>
            <input
              type="email"
              className={`w-full p-4 text-lg border rounded-xl focus:ring-2 outline-none ${emailValid ? 'border-green-500 focus:ring-green-200' : 'border-slate-200 focus:border-primary focus:ring-primary/20'}`}
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              autoFocus
            />
            {emailValid && <p className="text-green-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={14}/> Email válido</p>}
          </div>
        );

      case 'password':
        return (
          <div>
            <input
              type="password"
              className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              autoFocus
            />
            {renderPasswordValidations()}
          </div>
        );

      case 'confirmPassword':
        return (
          <input
            type="password"
            className={`w-full p-4 text-lg border rounded-xl focus:ring-2 outline-none ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-primary focus:ring-primary/20'}`}
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            autoFocus
          />
        );

      case 'dni':
        return (
          <div>
            <input
              type="text"
              className={`w-full p-4 text-lg border rounded-xl focus:ring-2 outline-none ${dniValid ? 'border-green-500 focus:ring-green-200' : 'border-slate-200 focus:border-primary focus:ring-primary/20'}`}
              placeholder="12345678"
              value={formData.dni}
              onChange={(e) => handleChange('dni', e.target.value)}
              autoFocus
            />
            {dniValid && <p className="text-green-600 text-sm mt-2 flex items-center gap-1"><CheckCircle size={14}/> DNI válido</p>}
          </div>
        );

      case 'fecha_nacimiento':
        return (
          <input
            type="date"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            value={formData.fecha_nacimiento}
            onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
          />
        );

      case 'categoria':
        return (
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-secondary mb-3">Caballeros</h3>
              <div className="space-y-2">
                {CATEGORIAS_CABALLEROS.map(cat => (
                  <label key={cat} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="categoria"
                      value={cat}
                      checked={formData.categoria === cat}
                      onChange={(e) => handleChange('categoria', e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-slate-700">{cat.replace('Caballeros ', '')}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-secondary mb-3">Damas</h3>
              <div className="space-y-2">
                {CATEGORIAS_DAMAS.map(cat => (
                  <label key={cat} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="categoria"
                      value={cat}
                      checked={formData.categoria === cat}
                      onChange={(e) => handleChange('categoria', e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-slate-700">{cat.replace('Damas ', '')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'direccion':
        return (
          <input
            type="text"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Calle 123"
            value={formData.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            autoFocus
          />
        );

      case 'localidad':
        return (
          <input
            type="text"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Posadas"
            value={formData.localidad}
            onChange={(e) => handleChange('localidad', e.target.value)}
            autoFocus
          />
        );

      case 'provincia':
        return (
          <select
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
            value={formData.provincia}
            onChange={(e) => handleChange('provincia', e.target.value)}
          >
            {PROVINCIAS_ARGENTINAS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        );

      case 'telefono':
        return (
          <input
            type="tel"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="3764123456"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            autoFocus
          />
        );

      case 'fotoArchivo':
        return (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary transition-colors bg-slate-50 cursor-pointer relative">
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                if(e.target.files[0]) handleChange('fotoArchivo', e.target.files[0]);
              }}
            />
            {formData.fotoArchivo ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(formData.fotoArchivo)}
                  alt="Vista previa"
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-md"
                />
                <p className="mt-4 text-green-600 font-medium">Imagen seleccionada</p>
                <p className="text-sm text-slate-400">Clic para cambiar</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <UploadCloud size={48} className="text-slate-300" />
                <p className="font-medium">Haz clic o arrastra una imagen</p>
                <p className="text-sm text-slate-400">JPG, PNG o WEBP</p>
              </div>
            )}
          </div>
        );

      case 'resumen':
        return (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-6 text-green-600">
              <CheckCircle size={32} />
              <h3 className="text-xl font-bold">¡Casi listo!</h3>
            </div>
            <div className="space-y-3 text-slate-600">
              <p><strong className="text-secondary">Nombre:</strong> {formData.nombre} {formData.apellido}</p>
              <p><strong className="text-secondary">Email:</strong> {formData.email}</p>
              <p><strong className="text-secondary">DNI:</strong> {formData.dni}</p>
              <p><strong className="text-secondary">Categoría:</strong> {formData.categoria}</p>
              <p><strong className="text-secondary">Ubicación:</strong> {formData.localidad}, {formData.provincia}</p>
              {formData.telefono && <p><strong className="text-secondary">Teléfono:</strong> {formData.telefono}</p>}
              {formData.fotoArchivo && <p><strong className="text-secondary">Foto:</strong> Seleccionada</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        
        {/* Header Progress */}
        <div className="bg-secondary p-6 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
           <div className="relative z-10 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                 <currentPaso.icon size={20} className="text-primary" />
               </div>
               <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Paso {currentStep + 1} de {totalSteps + 1}</p>
                <h2 className="text-xl font-bold text-white">{currentPaso.title}</h2>
              </div>
             </div>
             <Link to="/registro/seleccion" className="text-white/50 hover:text-white transition-colors">
               <CheckCircle size={20} />
             </Link>
           </div>
           
           {/* Progress Bar */}
           <div className="mt-6 h-1.5 bg-white/10 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-primary"
               initial={{ width: 0 }}
               animate={{ width: `${((currentStep + 1) / (totalSteps + 1)) * 100}%` }}
               transition={{ duration: 0.3 }}
             />
           </div>
        </div>

        {/* Content Body */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
              {renderPregunta()}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-100">
            <button 
              onClick={handleBack}
              className="text-slate-500 font-bold hover:text-secondary transition-colors flex items-center gap-2 px-4 py-2"
            >
              <ArrowLeft size={18} /> Atrás
            </button>
            
            <button
              onClick={handleNext}
              className="btn-primary py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              {currentStep === totalSteps ? 'Confirmar registro' : 'Siguiente'}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}