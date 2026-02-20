// src/services/authService.js
import supabase from './supabaseClient';

async function subirFotoPerfil(userId, file) {
  if (!file) return null;

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `fotos-perfil/${fileName}`;

  const { error } = await supabase.storage
    .from('fotos-perfil')
    .upload(filePath, file, { upsert: false });

  if (error) return null;

  const { data } = supabase.storage.from('fotos-perfil').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function registrarClubCompleto(
  email,
  password,
  nombre,
  direccion,
  localidad,
  provincia,
  telefono,
  cantidad_canchas,
  servicios,
  fotoArchivo,
  responsable_nombre,
  responsable_dni
) {
  const { data, error: authError } = await supabase.auth.signUp({ email, password });

  if (authError) throw authError;
  if (!data.user) throw new Error('No se creó el usuario');

  const userId = data.user.id;
  let fotoUrl = null;

  if (fotoArchivo) {
    fotoUrl = await subirFotoPerfil(userId, fotoArchivo);
  }

  const { error: userError } = await supabase.from('usuarios').insert({
    id: userId,
    email,
    nombre,
    tipo: 'club',
    foto_perfil_url: fotoUrl,
  });

  if (userError) throw userError;

  const { error: clubError } = await supabase.from('clubes').insert({
    id: userId,
    nombre,
    direccion,
    localidad,
    provincia,
    telefono,
    email,
    cantidad_canchas,
    servicios,
    foto_url: fotoUrl,
    responsable_nombre,
    responsable_dni,
  });

  if (clubError) throw clubError;

  return data;
}

export async function registrarJugadorCompleto(
  email,
  password,
  nombre,
  apellido,
  dni,
  fecha_nacimiento,
  direccion,
  localidad,
  provincia,
  telefono,
  categoria,
  fotoArchivo,
  nivel_juego,  // Nuevo
  posicion_preferida,  // Nuevo
  estilo_juego  // Nuevo (opcional)
) {
  let foto_perfil_url = null;
  if (fotoArchivo) {
    const userIdTemp = crypto.randomUUID();  // Temp ID para upload; se sobreescribe después
    foto_perfil_url = await subirFotoPerfil(userIdTemp, fotoArchivo);
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/auth/register-jugador`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      nombre,
      apellido,
      dni,
      fecha_nacimiento,
      direccion,
      localidad,
      provincia,
      telefono,
      categoria,
      nivel_juego,
      posicion_preferida,
      estilo_juego,
      foto_perfil_url  // Pasa la URL ya subida
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al registrar jugador');
  }

  const { user_id } = await response.json();

  // Si foto se subió con temp ID, actualiza el path con real user_id si es necesario (opcional, si querés renombrar)
  return { user: { id: user_id } };  // Simula el return anterior para compatibilidad
}

// Actualiza obtenerPerfilUsuario (cambia 'usuarios' a 'jugadores')
export async function obtenerPerfilUsuario() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data } = await supabase
    .from('jugadores')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return data;
}

// En iniciarSesion: Quita 'tipo' (ya no existe). Para detectar, chequea tablas:
// Ejemplo simplificado
export async function iniciarSesion(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // Detectar tipo
  const { data: jugador } = await supabase.from('jugadores').select('id').eq('id', data.user.id).single();
  const { data: club } = await supabase.from('clubes').select('id').eq('id', data.user.id).single();
  const { data: empleado } = await supabase.from('empleados_club').select('id').eq('user_id', data.user.id).single();

  let tipo = 'desconocido';
  if (jugador) tipo = 'jugador';
  else if (club) tipo = 'club';
  else if (empleado) tipo = 'empleado';

  return { ...data, tipo };
}



export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}



// EMPLEADOS
export async function crearEmpleado(
  clubId,
  nombre,
  apellido,
  dni,
  email,
  password,
  telefono,
  direccion,
  localidad,
  provincia,
  fecha_nacimiento,
  rol
) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/crear-empleado`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      clubId,
      nombre,
      apellido,
      dni,
      email,
      password,
      telefono,
      direccion,
      localidad,
      provincia,
      fecha_nacimiento,
      rol,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al crear empleado');
  }

  return await response.json();
}

export async function editarEmpleado(
  empleadoId,
  nombre,
  apellido,
  dni,
  email,
  rol,
  telefono,
  direccion,
  localidad,
  provincia,
  fecha_nacimiento
) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/editar-empleado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      empleadoId,
      nombre,
      apellido,
      dni,
      email,
      rol,
      telefono,
      direccion,
      localidad,
      provincia,
      fecha_nacimiento,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al editar empleado');
  }

  return await response.json();
}

export async function eliminarEmpleado(empleadoId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/eliminar-empleado`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ empleadoId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al eliminar empleado');
  }

  return await response.json();
}

// PRODUCTOS
export async function crearProducto(nombre, precio, stock, categoria = 'general') {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/crear-producto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ nombre, precio, stock, categoria }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al crear producto');
  }

  return await response.json();
}

export async function editarProducto(productoId, nombre, precio, stock, categoria = 'general') {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/editar-producto`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ productoId, nombre, precio, stock, categoria }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al editar producto');
  }

  return await response.json();
}

export async function eliminarProducto(productoId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/eliminar-producto`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ productoId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al eliminar producto');
  }

  return await response.json();
}

// Check-in con QR
export async function checkInCancha(reservaId, canchaId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/checkin-cancha`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ reservaId, canchaId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error en check-in');
  }

  return await response.json();
}

// Agregar producto a cuenta (corregido: quitamos session unused)
export async function agregarProductoCuenta(cuentaId, productoId, cantidad = 1) {
  const { data: producto, error: prodError } = await supabase
    .from('productos')
    .select('precio, nombre, stock')
    .eq('id', productoId)
    .single();

  if (prodError || !producto) throw new Error('Producto no encontrado');

  const subtotal = producto.precio * cantidad;

  const { error: insertError } = await supabase
    .from('cuenta_items')
    .insert({
      cuenta_id: cuentaId,
      tipo: 'producto',
      descripcion: producto.nombre,
      cantidad,
      precio_unitario: producto.precio,
      subtotal,
    });

  if (insertError) throw insertError;

  // Actualizar total cuenta (asumiendo que tenés un RPC)
  const { error: rpcError } = await supabase.rpc('actualizar_total_cuenta', { cuenta_id: cuentaId });
  if (rpcError) console.warn('No se pudo actualizar total cuenta', rpcError);

  // Restar stock
  const { error: stockError } = await supabase
    .from('productos')
    .update({ stock: producto.stock - cantidad })
    .eq('id', productoId);

  if (stockError) throw stockError;
}

// Agregá al final

// CREAR CANCHA
export async function crearCancha(nombre, tipo, precio_hora) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/crear-cancha`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ nombre, tipo, precio_hora }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al crear cancha');
  }

  return await response.json();
}

// EDITAR CANCHA
export async function editarCancha(canchaId, nombre, tipo, precio_hora) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/editar-cancha`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ canchaId, nombre, tipo, precio_hora }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al editar cancha');
  }

  return await response.json();
}

// ELIMINAR CANCHA
export async function eliminarCancha(canchaId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/eliminar-cancha`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ canchaId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al eliminar cancha');
  }

  return await response.json();
}

// CREAR RESERVA MANUAL
export async function crearReservaManual(canchaId, usuarioId, fecha, hora_inicio, hora_fin, precio_total, estado_pago = 'pendiente') {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/crear-reserva-manual`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ canchaId, usuarioId, fecha, hora_inicio, hora_fin, precio_total, estado_pago }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al crear reserva');
  }

  return await response.json();
}

// EDITAR RESERVA MANUAL
export async function editarReservaManual(reservaId, canchaId, fecha, hora_inicio, hora_fin, precio_total, estado_pago) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/editar-reserva-manual`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ reservaId, canchaId, fecha, hora_inicio, hora_fin, precio_total, estado_pago }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al editar reserva');
  }

  return await response.json();
}

// ELIMINAR RESERVA MANUAL
export async function eliminarReservaManual(reservaId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/eliminar-reserva-manual`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ reservaId }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al eliminar reserva');
  }

  return await response.json();
}

// GET JUGADORES
export async function getJugadores() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/get-jugadores`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al cargar jugadores');
  }

  return await response.json();
}

// Obtener config precios
export async function getConfigPrecios() {
  const { data } = await supabase
    .from('config_precios')
    .select('*')
    .single();

  return data || { precio_base: 20000, min_precio: 16000, max_precio: 22000, dinamico_activado: true };
}

// Actualizar config precios
export async function updateConfigPrecios(precio_base, min_precio, max_precio, dinamico_activado) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No hay sesión activa');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const response = await fetch(`${supabaseUrl}/functions/v1/editar-config-precios`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ precio_base, min_precio, max_precio, dinamico_activado }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Error al actualizar config precios');
  }

  return await response.json();
}