import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, Phone, Mail, Lock, Dumbbell, Star, Camera, CheckCircle, ArrowRight, ArrowLeft, User, CreditCard, UploadCloud 
} from 'lucide-react';
import { message } from 'antd';
import { registrarClubCompleto } from '../services/authService';
import { PROVINCIAS_ARGENTINAS } from '../utils/provincias';

const SERVICIOS_POSIBLES = [
  'ducha', 'cantina', 'parrilla', 'alquiler_paletas', 'alquiler_pelotas', 'estacionamiento', 'wifi', 'tienda'
];

export default function RegistroDinamicoClub() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    localidad: '',
    provincia: 'Misiones',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    cantidad_canchas: 1,
    servicios: [],
    fotoArchivo: null,
    responsable_nombre: '',
    responsable_dni: '',
  });

  const totalSteps = 12;
  
  const pasos = [
    { id: 'nombre', title: 'Nombre del Club', icon: Building2 },
    { id: 'direccion', title: 'Ubicación', icon: MapPin },
    { id: 'localidad', title: 'Localidad', icon: MapPin },
    { id: 'provincia', title: 'Provincia', icon: MapPin },
    { id: 'telefono', title: 'Teléfono de contacto', icon: Phone },
    { id: 'email', title: 'Email del Club', icon: Mail },
    { id: 'password', title: 'Contraseña', icon: Lock },
    { id: 'confirmPassword', title: 'Confirmar Contraseña', icon: Lock },
    { id: 'cantidad_canchas', title: 'Cantidad de Canchas', icon: Dumbbell },
    { id: 'servicios', title: 'Servicios Ofrecidos', icon: Star },
    { id: 'fotoArchivo', title: 'Foto del Club', icon: Camera },
    { id: 'responsable', title: 'Datos del Responsable', icon: User },
    { id: 'resumen', title: '¡Casi listo!', icon: CheckCircle },
  ];

  const currentPaso = pasos[currentStep];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServicioToggle = (servicio) => {
    setFormData(prev => {
      const nuevos = prev.servicios.includes(servicio)
        ? prev.servicios.filter(s => s !== servicio)
        : [...prev.servicios, servicio];
      return { ...prev, servicios: nuevos };
    });
  };

  const handleNext = async () => {
    const pasoActual = currentPaso.id;

    // Validaciones simples
    if (pasoActual === 'password' && formData.password.length < 6) {
      message.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (pasoActual === 'confirmPassword' && formData.password !== formData.confirmPassword) {
      message.error('Las contraseñas no coinciden');
      return;
    }
    if (pasoActual !== 'fotoArchivo' && pasoActual !== 'servicios' && !formData[pasoActual] && pasoActual !== 'resumen') {
      // Ignorar validación vacía para campos opcionales o arrays
      if (pasoActual === 'responsable') {
         if(!formData.responsable_nombre || !formData.responsable_dni) {
           message.error('Completa los datos del responsable');
           return;
         }
      } else {
         message.error('Este campo es obligatorio');
         return;
      }
    }

    if (currentStep === totalSteps) {
      try {
        await registrarClubCompleto(
          formData.email,
          formData.password,
          formData.nombre,
          formData.direccion,
          formData.localidad,
          formData.provincia,
          formData.telefono,
          formData.cantidad_canchas,
          formData.servicios,
          formData.fotoArchivo,
          formData.responsable_nombre,
          formData.responsable_dni
        );
        message.success('¡Club registrado exitosamente!');
        navigate('/panel-club', { replace: true });
      } catch (err) {
        message.error(err.message || 'Error al registrar el club');
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

  const renderPregunta = () => {
    switch (currentPaso.id) {
      case 'nombre':
        return (
          <input
            type="text"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Ej: Padel Center Posadas"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            autoFocus
          />
        );
      case 'direccion':
        return (
          <input
            type="text"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Av. Corrientes 1234"
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
            placeholder="3764..."
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            autoFocus
          />
        );
      case 'email':
        return (
          <input
            type="email"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="club@email.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            autoFocus
          />
        );
      case 'password':
        return (
          <input
            type="password"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            autoFocus
          />
        );
      case 'confirmPassword':
        return (
          <input
            type="password"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Repite la contraseña"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            autoFocus
          />
        );
      case 'cantidad_canchas':
        return (
          <input
            type="number"
            min="1"
            className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            value={formData.cantidad_canchas}
            onChange={(e) => handleChange('cantidad_canchas', parseInt(e.target.value))}
            autoFocus
          />
        );
      case 'servicios':
        return (
          <div className="grid grid-cols-2 gap-4">
            {SERVICIOS_POSIBLES.map(servicio => (
              <label 
                key={servicio} 
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  formData.servicios.includes(servicio) 
                    ? 'border-primary bg-primary/10 text-secondary font-bold' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.servicios.includes(servicio)}
                  onChange={() => handleServicioToggle(servicio)}
                />
                <span className="capitalize">{servicio.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
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
      case 'responsable':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                value={formData.responsable_nombre}
                onChange={(e) => handleChange('responsable_nombre', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">DNI</label>
              <input
                type="text"
                className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                value={formData.responsable_dni}
                onChange={(e) => handleChange('responsable_dni', e.target.value)}
              />
            </div>
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
              <p><strong className="text-secondary">Club:</strong> {formData.nombre}</p>
              <p><strong className="text-secondary">Ubicación:</strong> {formData.localidad}, {formData.provincia}</p>
              <p><strong className="text-secondary">Responsable:</strong> {formData.responsable_nombre}</p>
              <p><strong className="text-secondary">Email:</strong> {formData.email}</p>
              <p><strong className="text-secondary">Canchas:</strong> {formData.cantidad_canchas}</p>
              <p><strong className="text-secondary">Servicios:</strong> {formData.servicios.length} seleccionados</p>
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