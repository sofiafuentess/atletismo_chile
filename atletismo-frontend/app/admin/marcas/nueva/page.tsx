"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { crearMarca, getPruebas, getAtletas, getCompetencias } from "@/lib/api"

interface Competencia { id: number; nombre: string; fecha_inicio: string; nivel: string }
interface Prueba { id: number; nombre: string; unidad: string }
interface Atleta { id: number; nombre: string; apellido: string; categoria: string }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">{label}</label>
      {children}
    </div>
  )
}

const inputClass = "w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"

export default function NuevaMarca() {
  const [competencias, setCompetencias] = useState<Competencia[]>([])
  const [pruebas, setPruebas] = useState<Prueba[]>([])
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [exito, setExito] = useState("")
  const [busquedaAtleta, setBusquedaAtleta] = useState("")

  const [form, setForm] = useState({
    atleta_id: "",
    prueba_id: "",
    competencia_id: "",
    resultado: "",
    ronda: "final",
    posicion: "",
    viento: "",
    homologada: true,
    fecha: ""
  })

  const set = (campo: string, valor: string | boolean) =>
    setForm(prev => ({ ...prev, [campo]: valor }))

  useEffect(() => {
    getPruebas().then(setPruebas)
    getAtletas().then(setAtletas)
    getCompetencias().then(setCompetencias)
  }, [])

  const atletasFiltrados = atletas.filter(a =>
    `${a.nombre} ${a.apellido}`.toLowerCase().includes(busquedaAtleta.toLowerCase())
  )

  const pruebaSeleccionada = pruebas.find(p => p.id === Number(form.prueba_id))

  const handleSubmit = async () => {
    if (!form.atleta_id || !form.prueba_id || !form.competencia_id || !form.resultado || !form.fecha) {
      setError("Atleta, prueba, competencia, resultado y fecha son obligatorios")
      return
    }
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token") || ""
      const datos = {
        atleta_id: Number(form.atleta_id),
        prueba_id: Number(form.prueba_id),
        competencia_id: Number(form.competencia_id),
        resultado: Number(form.resultado),
        ronda: form.ronda,
        posicion: form.posicion ? Number(form.posicion) : null,
        viento: form.viento ? Number(form.viento) : null,
        homologada: form.homologada,
        fecha: form.fecha
      }
      const nueva = await crearMarca(datos, token)
      setExito(`Marca registrada${nueva.es_pb ? " — ¡Nuevo PB!" : ""}`)
      setForm({
        atleta_id: "", prueba_id: "", competencia_id: "", resultado: "",
        ronda: "final", posicion: "", viento: "", homologada: true, fecha: ""
      })
      setBusquedaAtleta("")
    } catch {
      setError("Error al registrar la marca")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-8 py-6 flex items-center justify-between">
        <Link href="/admin" className="text-xl font-black tracking-tight">
          ATLETISMO <span className="text-yellow-400">CHILE</span>
        </Link>
        <Link href="/admin" className="text-sm text-white/40 hover:text-white transition-colors">
          ← Volver al dashboard
        </Link>
      </header>

      <div className="px-8 py-10 max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-yellow-400 text-xs tracking-widest uppercase mb-2">Registro</p>
          <h2 className="text-4xl font-black tracking-tight">REGISTRAR MARCA</h2>
        </div>

        <div className="border border-white/10 p-8 space-y-6">

          {/* Buscar atleta */}
          <Field label="Atleta *">
            <input
              value={busquedaAtleta}
              onChange={e => setBusquedaAtleta(e.target.value)}
              className={inputClass}
              placeholder="Buscar por nombre..."
            />
            {busquedaAtleta && atletasFiltrados.length > 0 && (
              <div className="border border-white/10 border-t-0 max-h-48 overflow-y-auto">
                {atletasFiltrados.map(a => (
                  <button
                    key={a.id}
                    onClick={() => {
                      set("atleta_id", String(a.id))
                      setBusquedaAtleta(`${a.nombre} ${a.apellido}`)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 flex justify-between items-center ${
                      form.atleta_id === String(a.id) ? "bg-yellow-400/10 text-yellow-400" : ""
                    }`}
                  >
                    <span>{a.nombre} {a.apellido}</span>
                    <span className="text-xs text-white/30 uppercase">{a.categoria}</span>
                  </button>
                ))}
              </div>
            )}
          </Field>

          {/* Prueba */}
          <Field label="Prueba *">
            <select value={form.prueba_id} onChange={e => set("prueba_id", e.target.value)} className={inputClass}>
              <option value="" className="bg-black">Seleccionar prueba</option>
              {pruebas.map(p => (
                <option key={p.id} value={p.id} className="bg-black">{p.nombre}</option>
              ))}
            </select>
          </Field>

          {/* Competencia ID */}
          <Field label="Competencia *">
            <select value={form.competencia_id} onChange={e => set("competencia_id", e.target.value)} className={inputClass}>
                <option value="" className="bg-black">Seleccionar competencia</option>
                {competencias.map(c => (
                <option key={c.id} value={c.id} className="bg-black">
                    {c.nombre}
                </option>
             ))}
            </select>
            </Field>

          {/* Resultado */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={`Resultado * ${pruebaSeleccionada ? `(${pruebaSeleccionada.unidad === "s" ? "segundos" : "metros"})` : ""}`}>
              <input
                value={form.resultado}
                onChange={e => set("resultado", e.target.value)}
                className={inputClass}
                placeholder={pruebaSeleccionada?.unidad === "s" ? "11.76" : "6.45"}
                type="number"
                step="0.01"
              />
            </Field>
            <Field label="Viento (m/s)">
              <input
                value={form.viento}
                onChange={e => set("viento", e.target.value)}
                className={inputClass}
                placeholder="+1.4"
                type="number"
                step="0.1"
              />
            </Field>
          </div>

          {/* Ronda y posición */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ronda *">
              <select value={form.ronda} onChange={e => set("ronda", e.target.value)} className={inputClass}>
                <option value="serie" className="bg-black">Serie</option>
                <option value="semifinal" className="bg-black">Semifinal</option>
                <option value="final" className="bg-black">Final</option>
                <option value="unica" className="bg-black">Única</option>
              </select>
            </Field>
            <Field label="Posición">
              <input
                value={form.posicion}
                onChange={e => set("posicion", e.target.value)}
                className={inputClass}
                placeholder="1"
                type="number"
              />
            </Field>
          </div>

          {/* Fecha y homologada */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fecha *">
              <input
                type="date"
                value={form.fecha}
                onChange={e => set("fecha", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Homologada">
              <div className="flex border border-white/10 h-[46px]">
                {[
                  { value: true, label: "Sí" },
                  { value: false, label: "No" }
                ].map(h => (
                  <button
                    key={String(h.value)}
                    onClick={() => set("homologada", h.value)}
                    className={`flex-1 text-sm font-bold transition-colors ${
                      form.homologada === h.value
                        ? "bg-yellow-400 text-black"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {exito && (
            <div className="bg-yellow-400/10 border border-yellow-400/30 px-4 py-3 text-yellow-400 text-sm">
              ✓ {exito}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-3 font-black text-sm tracking-wide hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {loading ? "GUARDANDO..." : "REGISTRAR MARCA"}
          </button>

        </div>
      </div>
    </main>
  )
}