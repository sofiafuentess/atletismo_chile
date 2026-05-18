"use client"

import { useState } from "react"
import Link from "next/link"
import { crearCompetencia } from "@/lib/api"

const inputClass = "w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">{label}</label>
      {children}
    </div>
  )
}

export default function NuevaCompetencia() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [exito, setExito] = useState("")

  const [form, setForm] = useState({
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
    lugar: "",
    pais: "Chile",
    tipo: "nacional",
    organizacion: "federada",
    subtipo: "campeonato_nacional",
    nivel: "u18",
    escenario: "pista_aire_libre"
  })

  const set = (campo: string, valor: string) =>
    setForm(prev => ({ ...prev, [campo]: valor }))

  const handleSubmit = async () => {
    if (!form.nombre || !form.fecha_inicio || !form.fecha_fin) {
      setError("Nombre y fechas son obligatorios")
      return
    }
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token") || ""
      await crearCompetencia(form, token)
      setExito(`Competencia "${form.nombre}" creada correctamente`)
      setForm({
        nombre: "", fecha_inicio: "", fecha_fin: "", lugar: "",
        pais: "Chile", tipo: "nacional", organizacion: "federada",
        subtipo: "campeonato_nacional", nivel: "u18", escenario: "pista_aire_libre"
      })
    } catch {
      setError("Error al crear la competencia")
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
          <h2 className="text-4xl font-black tracking-tight">NUEVA COMPETENCIA</h2>
        </div>

        <div className="border border-white/10 p-8 space-y-6">

          <Field label="Nombre de la competencia *">
            <input
              value={form.nombre}
              onChange={e => set("nombre", e.target.value)}
              className={inputClass}
              placeholder="Campeonato Nacional U18 2026"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Fecha inicio *">
              <input type="date" value={form.fecha_inicio}
                onChange={e => set("fecha_inicio", e.target.value)}
                className={inputClass} />
            </Field>
            <Field label="Fecha fin *">
              <input type="date" value={form.fecha_fin}
                onChange={e => set("fecha_fin", e.target.value)}
                className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Lugar">
              <input
                value={form.lugar}
                onChange={e => set("lugar", e.target.value)}
                className={inputClass}
                placeholder="Estadio Nacional"
              />
            </Field>
            <Field label="País">
              <input
                value={form.pais}
                onChange={e => set("pais", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo">
              <select value={form.tipo} onChange={e => set("tipo", e.target.value)} className={inputClass}>
                <option value="nacional" className="bg-black">Nacional</option>
                <option value="internacional" className="bg-black">Internacional</option>
              </select>
            </Field>
            <Field label="Organización">
              <select value={form.organizacion} onChange={e => set("organizacion", e.target.value)} className={inputClass}>
                <option value="federada" className="bg-black">Federada</option>
                <option value="escolar" className="bg-black">Escolar</option>
                <option value="universitaria" className="bg-black">Universitaria</option>
                <option value="master" className="bg-black">Máster</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Subtipo">
              <select value={form.subtipo} onChange={e => set("subtipo", e.target.value)} className={inputClass}>
                <option value="campeonato_nacional" className="bg-black">Campeonato Nacional</option>
                <option value="grand_prix" className="bg-black">Grand Prix</option>
                <option value="regional" className="bg-black">Regional</option>
                <option value="fenaude" className="bg-black">FENAUDE</option>
                <option value="ldes" className="bg-black">LDES</option>
                <option value="internacional" className="bg-black">Internacional</option>
                <option value="otro" className="bg-black">Otro</option>
              </select>
            </Field>
            <Field label="Nivel">
              <select value={form.nivel} onChange={e => set("nivel", e.target.value)} className={inputClass}>
                {["u8","u10","u12","u14","u16","u18","u20","u23","adulto","master","todo_competidor"].map(n => (
                  <option key={n} value={n} className="bg-black">{n.toUpperCase()}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Escenario">
            <select value={form.escenario} onChange={e => set("escenario", e.target.value)} className={inputClass}>
              <option value="pista_aire_libre" className="bg-black">Pista aire libre</option>
              <option value="pista_cubierta" className="bg-black">Pista cubierta</option>
              <option value="ruta" className="bg-black">Ruta</option>
              <option value="campo" className="bg-black">Campo</option>
            </select>
          </Field>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {exito && (
            <div className="bg-yellow-400/10 border border-yellow-400/30 px-4 py-3 text-yellow-400 text-sm">
              ✓ {exito}
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-yellow-400 text-black py-3 font-black text-sm tracking-wide hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {loading ? "GUARDANDO..." : "CREAR COMPETENCIA"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}