"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { crearAtleta } from "@/lib/api"

const REGIONES = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama",
  "Coquimbo", "Valparaíso", "Metropolitana", "O'Higgins",
  "Maule", "Ñuble", "Biobío", "La Araucanía",
  "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
]

export default function NuevoAtleta() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [exito, setExito] = useState("")

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    genero: "F",
    region: "",
    colegio: "",
    club_id: ""
  })

  const set = (campo: string, valor: string) =>
    setForm(prev => ({ ...prev, [campo]: valor }))

  const handleSubmit = async () => {
    if (!form.nombre || !form.apellido || !form.fecha_nacimiento) {
      setError("Nombre, apellido y fecha de nacimiento son obligatorios")
      return
    }
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token") || ""
      const datos = {
        ...form,
        club_id: form.club_id ? Number(form.club_id) : null,
        colegio: form.colegio || null,
        region: form.region || null
      }
      await crearAtleta(datos, token)
      setExito("Atleta creado correctamente")
      setForm({ nombre: "", apellido: "", fecha_nacimiento: "", genero: "F", region: "", colegio: "", club_id: "" })
    } catch {
      setError("Error al crear el atleta. Verifica los datos.")
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
          <h2 className="text-4xl font-black tracking-tight">NUEVO ATLETA</h2>
        </div>

        <div className="border border-white/10 p-8 space-y-6">

          {/* Nombre y apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">
                Nombre *
              </label>
              <input
                value={form.nombre}
                onChange={e => set("nombre", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
                placeholder="María"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">
                Apellido *
              </label>
              <input
                value={form.apellido}
                onChange={e => set("apellido", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
                placeholder="González"
              />
            </div>
          </div>

          {/* Fecha y género */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">
                Fecha de nacimiento *
              </label>
              <input
                type="date"
                value={form.fecha_nacimiento}
                onChange={e => set("fecha_nacimiento", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">
                Género *
              </label>
              <div className="flex border border-white/10 h-[46px]">
                {[
                  { value: "F", label: "Femenino" },
                  { value: "M", label: "Masculino" }
                ].map(g => (
                  <button
                    key={g.value}
                    onClick={() => set("genero", g.value)}
                    className={`flex-1 text-sm font-bold transition-colors ${
                      form.genero === g.value
                        ? "bg-yellow-400 text-black"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Región */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">
              Región
            </label>
            <select
              value={form.region}
              onChange={e => set("region", e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
            >
              <option value="" className="bg-black">Seleccionar región</option>
              {REGIONES.map(r => (
                <option key={r} value={r} className="bg-black">{r}</option>
              ))}
            </select>
          </div>

          {/* Colegio */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">
              Colegio <span className="text-white/20">(opcional — solo escolares)</span>
            </label>
            <input
              value={form.colegio}
              onChange={e => set("colegio", e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
              placeholder="Nombre del colegio"
            />
          </div>

          {/* Mensajes */}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {exito && (
            <div className="bg-yellow-400/10 border border-yellow-400/30 px-4 py-3 text-yellow-400 text-sm">
              ✓ {exito}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-yellow-400 text-black py-3 font-black text-sm tracking-wide hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {loading ? "GUARDANDO..." : "CREAR ATLETA"}
            </button>
            <Link
              href="/atletas"
              className="border border-white/20 px-6 py-3 text-sm text-white/40 hover:text-white transition-colors"
            >
              Ver atletas
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}