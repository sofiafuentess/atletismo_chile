const API_URL = "http://localhost:8000"

export async function getRanking(
  pruebaId: number,
  genero?: string,
  anio?: number
) {
  const params = new URLSearchParams()
  if (genero) params.append("genero", genero)
  if (anio) params.append("anio", String(anio))
  const res = await fetch(`${API_URL}/rankings/${pruebaId}?${params}`)
  if (!res.ok) throw new Error("Error al cargar ranking")
  return res.json()
}

export async function getPruebas() {
  const res = await fetch(`${API_URL}/pruebas/`)
  if (!res.ok) throw new Error("Error al cargar pruebas")
  return res.json()
}

export async function getPerfilAtleta(id: number) {
  const res = await fetch(`${API_URL}/atletas/${id}/perfil`)
  if (!res.ok) throw new Error("Error al cargar atleta")
  return res.json()
}

export async function getAtletas() {
  const res = await fetch(`${API_URL}/atletas/`)
  if (!res.ok) throw new Error("Error al cargar atletas")
  return res.json()
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error("Credenciales incorrectas")
  return res.json()
}

export async function crearAtleta(datos: object, token: string) {
  const res = await fetch(`${API_URL}/atletas/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(datos)
  })
  if (!res.ok) throw new Error("Error al crear atleta")
  return res.json()
}

export async function crearCompetencia(datos: object, token: string) {
  const res = await fetch(`${API_URL}/competencias/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(datos)
  })
  if (!res.ok) throw new Error("Error al crear competencia")
  return res.json()
}

export async function crearMarca(datos: object, token: string) {
  const res = await fetch(`${API_URL}/marcas/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(datos)
  })
  if (!res.ok) throw new Error("Error al crear marca")
  return res.json()
}