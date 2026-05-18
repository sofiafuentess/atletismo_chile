"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAtletas } from "@/lib/api"

interface Atleta {
  id: number
  nombre: string
  apellido: string
  fecha_nacimiento: string
  genero: string
  region: string | null
  colegio: string | null
  club_id: number | null
  activo: boolean
  categoria: string
}

export default function AtletasPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [genero, setGenero] = useState<string>("")
  const [categoria, setCategoria] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const categorias = ["u8","u10","u12","u14","u16","u18","u20","u23","adulto","master"]

  useEffect(() => {
    getAtletas()
      .then(setAtletas)
      .finally(() => setLoading(false))
  }, [])

  const filtrados = atletas.filter((a) => {
    const nombre = `${a.nombre} ${a.apellido}`.toLowerCase()
    const matchBusqueda = nombre.includes(busqueda.toLowerCase())
    const matchGenero = genero ? a.genero === genero : true
    const matchCategoria = categoria ? a.categoria === categoria : true
    return matchBusqueda && matchGenero && matchCategoria
  })

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ATLETISMO <span className="text-yellow-400">CHILE</span>
        </Link>
        <nav className="flex gap-6 text-sm text-white/60">
          <Link href="/rankings" className="hover:text-white transition-colors">Rankings</Link>
          <Link href="/atletas" className="text-white">Atletas</Link>
        </nav>
      </header>

      <div className="px-8 py-10 max-w-6xl mx-auto">

        {/* Título */}
        <div className="mb-8">
          <p className="text-yellow-400 text-xs tracking-widest uppercase mb-2">
            Base de datos
          </p>
          <h2 className="text-4xl font-black tracking-tight">ATLETAS</h2>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-8 flex-wrap items-center">
          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-4 py-2 text-sm focus:outline-none focus:border-yellow-400 w-64 placeholder:text-white/20"
          />

          {/* Género */}
          <div className="flex border border-white/10">
            {[
              { value: "", label: "Todos" },
              { value: "F", label: "Femenino" },
              { value: "M", label: "Masculino" },
            ].map((g) => (
              <button
                key={g.value}
                onClick={() => setGenero(g.value)}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  genero === g.value
                    ? "bg-yellow-400 text-black"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Categoría */}
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-4 py-2 text-sm focus:outline-none focus:border-yellow-400"
          >
            <option value="" className="bg-black">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c} className="bg-black uppercase">{c.toUpperCase()}</option>
            ))}
          </select>

          {/* Contador */}
          <span className="text-white/20 text-sm ml-auto">
            {filtrados.length} atleta{filtrados.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="text-white/40 text-sm py-20 text-center">Cargando atletas...</div>
        ) : filtrados.length === 0 ? (
          <div className="text-white/40 text-sm py-20 text-center border border-white/10">
            No se encontraron atletas
          </div>
        ) : (
          <div className="border border-white/10">
            {/* Header tabla */}
            <div className="grid grid-cols-12 text-xs text-white/30 uppercase tracking-widest px-6 py-3 border-b border-white/10">
              <div className="col-span-4">Atleta</div>
              <div className="col-span-2">Categoría</div>
              <div className="col-span-2">Género</div>
              <div className="col-span-3">Región</div>
              <div className="col-span-1"></div>
            </div>

            {filtrados.map((atleta) => (
              <Link
                href={`/atletas/${atleta.id}`}
                key={atleta.id}
                className="grid grid-cols-12 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-yellow-400">
                      {atleta.nombre[0]}{atleta.apellido[0]}
                    </span>
                  </div>
                  <span className="font-bold">
                    {atleta.nombre} {atleta.apellido}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs bg-white/10 px-2 py-1 uppercase tracking-wider">
                    {atleta.categoria}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-white/40">
                  {atleta.genero === "F" ? "Femenino" : "Masculino"}
                </div>
                <div className="col-span-3 text-sm text-white/40">
                  {atleta.region || "—"}
                  {atleta.colegio && (
                    <span className="ml-2 text-white/20 text-xs">{atleta.colegio}</span>
                  )}
                </div>
                <div className="col-span-1 text-right text-white/20 text-xs">
                  ver →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}