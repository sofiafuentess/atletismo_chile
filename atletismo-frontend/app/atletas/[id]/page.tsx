"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getPerfilAtleta } from "@/lib/api"

interface PB {
  prueba: string
  tipo: string
  unidad: string
  resultado: number
  viento: number | null
  fecha: string
  ronda: string
}

interface MarcaHistorial {
  marca_id: number
  prueba: string
  resultado: number
  unidad: string
  ronda: string
  posicion: number | null
  viento: number | null
  es_pb: boolean
  homologada: boolean
  fecha: string
}

interface Perfil {
  id: number
  nombre: string
  apellido: string
  fecha_nacimiento: string
  categoria: string
  genero: string
  region: string
  colegio: string | null
  club_id: number | null
  total_marcas: number
  total_pruebas: number
  pbs: PB[]
  historial: MarcaHistorial[]
}

export default function PerfilAtleta() {
  const params = useParams()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      getPerfilAtleta(Number(params.id))
        .then(setPerfil)
        .finally(() => setLoading(false))
    }
  }, [params.id])

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

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-white/40">Cargando...</p>
    </div>
  )

  if (!perfil) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-white/40">Atleta no encontrado</p>
    </div>
  )

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
        </nav>
      </header>

      <div className="px-8 py-10 max-w-6xl mx-auto">

        {/* Perfil header */}
        <div className="flex items-start gap-8 mb-12">
          {/* Avatar */}
          <div className="w-20 h-20 bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-black text-yellow-400">
              {perfil.nombre[0]}{perfil.apellido[0]}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="text-yellow-400 text-xs tracking-widest uppercase mb-1">
              {perfil.categoria} · {perfil.genero === "F" ? "Femenino" : "Masculino"}
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-2">
              {perfil.nombre} {perfil.apellido}
            </h1>
            <div className="flex gap-4 text-sm text-white/40">
              {perfil.region && <span>{perfil.region}</span>}
              {perfil.colegio && <span>· {perfil.colegio}</span>}
              <span>· {perfil.fecha_nacimiento}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-px">
            {[
              { label: "Marcas", value: perfil.total_marcas },
              { label: "Pruebas", value: perfil.total_pruebas },
            ].map((s) => (
              <div key={s.label} className="border border-white/10 px-6 py-4 text-center">
                <div className="text-2xl font-black text-yellow-400">{s.value}</div>
                <div className="text-xs text-white/30 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PBs */}
        <div className="mb-12">
          <h2 className="text-xs text-white/30 uppercase tracking-widest mb-4">
            Marcas personales
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px">
            {perfil.pbs.map((pb) => (
              <div key={pb.prueba} className="border border-white/10 p-5 hover:bg-white/5 transition-colors">
                <div className="text-xs text-white/30 uppercase tracking-wider mb-2">
                  {pb.prueba}
                </div>
                <div className="text-2xl font-black text-yellow-400 font-mono">
                  {formatResultado(pb.resultado, pb.unidad)}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-white/20">
                  <span>{pb.fecha}</span>
                  {pb.viento != null && (
                    <span>{pb.viento > 0 ? "+" : ""}{pb.viento}m/s</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historial */}
        <div>
          <h2 className="text-xs text-white/30 uppercase tracking-widest mb-4">
            Historial completo
          </h2>
          <div className="border border-white/10">
            <div className="grid grid-cols-12 text-xs text-white/30 uppercase tracking-widest px-6 py-3 border-b border-white/10">
              <div className="col-span-3">Prueba</div>
              <div className="col-span-2">Ronda</div>
              <div className="col-span-2">Resultado</div>
              <div className="col-span-1">Pos.</div>
              <div className="col-span-1">Viento</div>
              <div className="col-span-3">Fecha</div>
            </div>
            {perfil.historial.map((m) => (
              <div
                key={m.marca_id}
                className={`grid grid-cols-12 px-6 py-3 border-b border-white/5 text-sm items-center ${
                  m.es_pb ? "bg-yellow-400/5" : ""
                }`}
              >
                <div className="col-span-3 font-medium">
                  {m.prueba}
                  {m.es_pb && (
                    <span className="ml-2 text-xs bg-yellow-400 text-black px-1.5 py-0.5 font-bold">
                      PB
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-white/40 capitalize">{m.ronda || "—"}</div>
                <div className={`col-span-2 font-mono font-bold ${m.es_pb ? "text-yellow-400" : ""}`}>
                  {formatResultado(m.resultado, m.unidad)}
                </div>
                <div className="col-span-1 text-white/40">{m.posicion || "—"}</div>
                <div className="col-span-1 text-white/40">
                  {m.viento != null ? `${m.viento > 0 ? "+" : ""}${m.viento}` : "—"}
                </div>
                <div className="col-span-3 text-white/40">{m.fecha}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}