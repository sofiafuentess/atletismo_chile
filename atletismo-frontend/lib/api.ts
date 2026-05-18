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