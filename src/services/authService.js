// src/services/authService.js
// ===============================
// MODO MOCK - DESARROLLO OFFLINE
// ===============================

const USE_MOCK = true

// -----------------------------
// USUARIOS MOCK
// -----------------------------
const mockUsers = [
  {
    id: "1",
    email: "club@padel.com",
    password: "1234",
    tipo: "club",
    nombre: "Club Admin",
  },
  {
    id: "2",
    email: "empleado@padel.com",
    password: "1234",
    tipo: "empleado",
    nombre: "Empleado Demo",
  },
  {
    id: "3",
    email: "jugador@padel.com",
    password: "1234",
    tipo: "jugador",
    nombre: "Jugador Demo",
  },
]

// -----------------------------
// AUTH
// -----------------------------

export async function iniciarSesion(email, password) {
  if (!USE_MOCK) throw new Error("Supabase desactivado")

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) throw new Error("Credenciales incorrectas")

  localStorage.setItem("mockSession", JSON.stringify(user))

  return {
    user,
    tipo: user.tipo,
  }
}

export async function cerrarSesion() {
  localStorage.removeItem("mockSession")
}

export async function obtenerPerfilUsuario() {
  const session = localStorage.getItem("mockSession")
  if (!session) return null
  return JSON.parse(session)
}

// -----------------------------
// REGISTROS (mock)
// -----------------------------

export async function registrarClubCompleto() {
  console.log("Mock registro club")
  return { ok: true }
}

export async function registrarJugadorCompleto() {
  console.log("Mock registro jugador")
  return { ok: true }
}

// -----------------------------
// EMPLEADOS
// -----------------------------

export async function crearEmpleado() {
  console.log("Mock crear empleado")
  return { ok: true }
}

export async function editarEmpleado() {
  console.log("Mock editar empleado")
  return { ok: true }
}

export async function eliminarEmpleado() {
  console.log("Mock eliminar empleado")
  return { ok: true }
}

// -----------------------------
// PRODUCTOS
// -----------------------------

export async function crearProducto() {
  console.log("Mock crear producto")
  return { ok: true }
}

export async function editarProducto() {
  console.log("Mock editar producto")
  return { ok: true }
}

export async function eliminarProducto() {
  console.log("Mock eliminar producto")
  return { ok: true }
}

// -----------------------------
// CANCHAS
// -----------------------------

export async function crearCancha() {
  console.log("Mock crear cancha")
  return { ok: true }
}

export async function editarCancha() {
  console.log("Mock editar cancha")
  return { ok: true }
}

export async function eliminarCancha() {
  console.log("Mock eliminar cancha")
  return { ok: true }
}

// -----------------------------
// RESERVAS
// -----------------------------

export async function crearReservaManual() {
  console.log("Mock crear reserva")
  return { ok: true }
}

export async function editarReservaManual() {
  console.log("Mock editar reserva")
  return { ok: true }
}

export async function eliminarReservaManual() {
  console.log("Mock eliminar reserva")
  return { ok: true }
}

// -----------------------------
// JUGADORES
// -----------------------------

export async function getJugadores() {
  return [
    { id: 3, nombre: "Jugador Demo 1" },
    { id: 4, nombre: "Jugador Demo 2" },
  ]
}

// -----------------------------
// PRECIOS
// -----------------------------

export async function getConfigPrecios() {
  return {
    precio_base: 20000,
    min_precio: 16000,
    max_precio: 22000,
    dinamico_activado: true,
  }
}

export async function updateConfigPrecios() {
  console.log("Mock update config precios")
  return { ok: true }
}