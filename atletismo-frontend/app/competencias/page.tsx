"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Competencia {
  id: number
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  lugar: string | null
  pais: string
  tipo: string
  organizacion: string
  subtipo: string
  nivel: string
  escenario: string
}

export default function CompetenciasPage() {
  const [competencias, setCompetencias] = useState<Competencia[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroNivel, setFiltroNivel] = useState("todos")

  useEffect(() => {
    fetch("http://localhost:8000/competencias/")
      .then((res) => res.json())
      .then(setCompetencias)
      .finally(() => setLoading(false))
  }, [])

  const filtradas = competencias.filter((c) => {
    const coincideTipo = filtroTipo === "todos" || c.tipo === filtroTipo
    const coincideNivel = filtroNivel === "todos" || c.nivel === filtroNivel
    return coincideTipo && coincideNivel
  })

  const niveles = [...new Set(competencias.map((c) => c.nivel))]

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  const colorNivel: Record<string, string> = {
    u8: "bg-blue-400/20 text-blue-300",
    u10: "bg-blue-400/20 text-blue-300",
    u12: "bg-cyan-400/20 text-cyan-300",
    u14: "bg-cyan-400/20 text-cyan-300",
    u16: "bg-green-400/20 text-green-300",
    u18: "bg-green-400/20 text-green-300",
    u20: "bg-yellow-400/20 text-yellow-300",
    u23: "bg-yellow-400/20 text-yellow-300",
    adulto: "bg-orange-400/20 text-orange-300",
    todo_competidor: "bg-white/10 text-white/60",
    master: "bg-purple-400/20 text-purple-300",
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ATLETISMO <span className="text-yellow-400">CHILE</span>
        </Link>
        <nav className="flex gap-6 text-sm text-white/60">
          <Link href="/rankings" className="hover:text-white transition-colors">Rankings</Link>
          <Link href="/atletas" className="hover:text-white transition-colors">Atletas</Link>
          <Link href="/competencias" className="text-white">Competencias</Link>
        </nav>
      </header>

      <div className="px-8 py-10 max-w-6xl mx-auto">

        {/* Título */}
        <div className="mb-8">
          <p className="text-yellow-400 text-xs tracking-widest uppercase mb-2">
            Calendario
          </p>
          <h2 className="text-4xl font-black tracking-tight">COMPETENCIAS</h2>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {/* Tipo */}
          <div className="flex border border-white/10">
            {[
              { label: "Todas", value: "todos" },
              { label: "Nacional", value: "nacional" },
              { label: "Internacional", value: "internacional" },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setFiltroTipo(t.value)}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  filtroTipo === t.value
                    ? "bg-yellow-400 text-black"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Nivel */}
          <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-4 py-2 text-sm focus:outline-none focus:border-yellow-400"
          >
            <option value="todos" className="bg-black">Todos los niveles</option>
            {niveles.map((n) => (
              <option key={n} value={n} className="bg-black">
                {n.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Contador */}
        <p className="text-xs text-white/30 uppercase tracking-widest mb-4">
          {filtradas.length} competencia{filtradas.length !== 1 ? "s" : ""}
        </p>

        {/* Lista */}
        {loading ? (
          <div className="text-white/40 text-sm py-20 text-center">
            Cargando competencias...
          </div>
        ) : filtradas.length > 0 ? (
          <div className="flex flex-col gap-px">
            {filtradas.map((comp) => (
              <div
                key={comp.id}
                className="border border-white/10 px-6 py-5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Nombre */}
                    <h3 className="font-bold text-lg mb-2">{comp.nombre}</h3>

                    {/* Tags */}
                    <div className="flex gap-2 flex-wrap mb-3">
                      <span className={`text-xs px-2 py-0.5 uppercase tracking-wider ${
                        colorNivel[comp.nivel] || "bg-white/10 text-white/50"
                      }`}>
                        {comp.nivel}
                      </span>
                      <span className="text-xs px-2 py-0.5 uppercase tracking-wider bg-white/5 text-white/40">
                        {comp.organizacion}
                      </span>
                      <span className="text-xs px-2 py-0.5 uppercase tracking-wider bg-white/5 text-white/40">
                        {comp.escenario.replace("_", " ")}
                      </span>
                      {comp.tipo === "internacional" && (
                        <span className="text-xs px-2 py-0.5 uppercase tracking-wider bg-yellow-400/20 text-yellow-300">
                          Internacional
                        </span>
                      )}
                    </div>

                    {/* Lugar */}
                    <p className="text-sm text-white/40">
                      {comp.lugar || "Lugar por confirmar"} · {comp.pais}
                    </p>
                  </div>

                  {/* Fechas */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-yellow-400 font-mono font-bold text-sm">
                      {formatFecha(comp.fecha_inicio)}
                    </div>
                    {comp.fecha_inicio !== comp.fecha_fin && (
                      <div className="text-white/30 font-mono text-sm">
                        — {formatFecha(comp.fecha_fin)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white/40 text-sm py-20 text-center border border-white/10">
            No hay competencias registradas
          </div>
        )}
      </div>
    </main>
  )
}