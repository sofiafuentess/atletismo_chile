"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getPruebas, getRanking } from "@/lib/api"

interface Prueba {
  id: number
  nombre: string
  tipo: string
  unidad: string
}

interface RankingEntry {
  posicion: number
  atleta_id: number
  nombre: string
  apellido: string
  categoria: string
  region: string
  resultado: number
  viento: number | null
  fecha: string
  ronda: string
}

interface Ranking {
  prueba: string
  unidad: string
  genero: string
  anio: string | number
  total: number
  ranking: RankingEntry[]
}

export default function RankingsPage() {
  const [pruebas, setPruebas] = useState<Prueba[]>([])
  const [pruebaId, setPruebaId] = useState<number>(2)
  const [genero, setGenero] = useState<string>("F")
  const [anio, setAnio] = useState<number>(2026)
  const [ranking, setRanking] = useState<Ranking | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPruebas().then(setPruebas)
  }, [])

  useEffect(() => {
    setLoading(true)
    getRanking(pruebaId, genero, anio)
      .then(setRanking)
      .finally(() => setLoading(false))
  }, [pruebaId, genero, anio])

  const formatResultado = (resultado: number, unidad: string) => {
    if (unidad === "s") {
      if (resultado >= 60) {
        const min = Math.floor(resultado / 60)
        const seg = (resultado % 60).toFixed(2).padStart(5, "0")
        return `${min}:${seg}`
      }
      return resultado.toFixed(2)
    }
    return resultado.toFixed(2) + "m"
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ATLETISMO <span className="text-yellow-400">CHILE</span>
        </Link>
        <nav className="flex gap-6 text-sm text-white/60">
          <Link href="/rankings" className="text-white">Rankings</Link>
          <Link href="/atletas" className="hover:text-white transition-colors">Atletas</Link>
        </nav>
      </header>

      <div className="px-8 py-10 max-w-6xl mx-auto">
        {/* Título */}
        <div className="mb-8">
          <p className="text-yellow-400 text-xs tracking-widest uppercase mb-2">
            Temporada {anio}
          </p>
          <h2 className="text-4xl font-black tracking-tight">RANKINGS NACIONALES</h2>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {/* Prueba */}
          <select
            value={pruebaId}
            onChange={(e) => setPruebaId(Number(e.target.value))}
            className="bg-white/5 border border-white/10 text-white px-4 py-2 text-sm focus:outline-none focus:border-yellow-400"
          >
            {pruebas.map((p) => (
              <option key={p.id} value={p.id} className="bg-black">
                {p.nombre}
              </option>
            ))}
          </select>

          {/* Género */}
          <div className="flex border border-white/10">
            {["F", "M"].map((g) => (
              <button
                key={g}
                onClick={() => setGenero(g)}
                className={`px-6 py-2 text-sm font-bold transition-colors ${
                  genero === g
                    ? "bg-yellow-400 text-black"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {g === "F" ? "Femenino" : "Masculino"}
              </button>
            ))}
          </div>

          {/* Año */}
          <div className="flex border border-white/10">
            {[2024, 2025, 2026].map((a) => (
              <button
                key={a}
                onClick={() => setAnio(a)}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  anio === a
                    ? "bg-yellow-400 text-black"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="text-white/40 text-sm py-20 text-center">
            Cargando ranking...
          </div>
        ) : ranking && ranking.ranking.length > 0 ? (
          <div className="border border-white/10">
            {/* Header tabla */}
            <div className="grid grid-cols-12 text-xs text-white/30 uppercase tracking-widest px-6 py-3 border-b border-white/10">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Atleta</div>
              <div className="col-span-2">Categoría</div>
              <div className="col-span-2">Región</div>
              <div className="col-span-2 text-right">Marca</div>
              <div className="col-span-1 text-right">Viento</div>
            </div>

            {/* Filas */}
            {ranking.ranking.map((entry, i) => (
              <Link
                href={`/atletas/${entry.atleta_id}`}
                key={entry.atleta_id}
                className={`grid grid-cols-12 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center ${
                  i === 0 ? "bg-yellow-400/5" : ""
                }`}
              >
                <div className={`col-span-1 font-black text-lg ${
                  i === 0 ? "text-yellow-400" : "text-white/20"
                }`}>
                  {entry.posicion}
                </div>
                <div className="col-span-4">
                  <span className="font-bold text-white">
                    {entry.nombre} {entry.apellido}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs bg-white/10 px-2 py-1 uppercase tracking-wider">
                    {entry.categoria}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-white/40">
                  {entry.region || "—"}
                </div>
                <div className={`col-span-2 text-right font-mono font-bold text-lg ${
                  i === 0 ? "text-yellow-400" : "text-white"
                }`}>
                  {formatResultado(entry.resultado, ranking.unidad)}
                </div>
                <div className="col-span-1 text-right text-xs text-white/30">
                  {entry.viento != null ? `${entry.viento > 0 ? "+" : ""}${entry.viento}` : "—"}
                </div>
              </Link>
            ))}

            {/* Footer */}
            <div className="px-6 py-3 text-xs text-white/20">
              {ranking.total} atleta{ranking.total !== 1 ? "s" : ""} — {ranking.prueba} {genero === "F" ? "Femenino" : "Masculino"} {anio}
            </div>
          </div>
        ) : (
          <div className="text-white/40 text-sm py-20 text-center border border-white/10">
            No hay marcas registradas para esta selección
          </div>
        )}
      </div>
    </main>
  )
}