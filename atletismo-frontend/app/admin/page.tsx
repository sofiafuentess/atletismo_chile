"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [rol, setRol] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/admin/login")
      return
    }
    setNombre(localStorage.getItem("nombre") || "")
    setRol(localStorage.getItem("rol") || "")
  }, [router])

  const cerrarSesion = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("rol")
    localStorage.removeItem("nombre")
    router.push("/admin/login")
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight">
            ATLETISMO <span className="text-yellow-400">CHILE</span>
          </h1>
          <p className="text-xs text-white/30 uppercase tracking-widest mt-0.5">
            Panel de administración
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-bold">{nombre}</div>
            <div className="text-xs text-yellow-400 uppercase tracking-wider">{rol}</div>
          </div>
          <button
            onClick={cerrarSesion}
            className="border border-white/20 px-4 py-2 text-xs text-white/40 hover:text-white hover:border-white/40 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-yellow-400 text-xs tracking-widest uppercase mb-2">
            Bienvenido
          </p>
          <h2 className="text-4xl font-black tracking-tight">DASHBOARD</h2>
        </div>

        {/* Acciones principales */}
        <div className="grid grid-cols-3 gap-px mb-10">
          {[
            {
              href: "/admin/atletas/nuevo",
              titulo: "Nuevo atleta",
              desc: "Registrar un atleta en el sistema",
              icon: "👤"
            },
            {
              href: "/admin/competencias/nueva",
              titulo: "Nueva competencia",
              desc: "Registrar una competencia",
              icon: "🏟️"
            },
            {
              href: "/admin/marcas/nueva",
              titulo: "Registrar marca",
              desc: "Cargar resultado de un atleta",
              icon: "⏱️"
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border border-white/10 p-6 hover:bg-white/5 transition-colors group"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <div className="font-bold text-white group-hover:text-yellow-400 transition-colors mb-1">
                {item.titulo}
              </div>
              <div className="text-xs text-white/30">{item.desc}</div>
            </Link>
          ))}
        </div>

        {/* Links rápidos */}
        <div className="border border-white/10 p-6">
          <h3 className="text-xs text-white/30 uppercase tracking-widest mb-4">
            Acceso rápido
          </h3>
          <div className="flex gap-4 flex-wrap">
            <Link href="/rankings" className="text-sm text-white/40 hover:text-yellow-400 transition-colors">
              Ver rankings →
            </Link>
            <Link href="/atletas" className="text-sm text-white/40 hover:text-yellow-400 transition-colors">
              Ver atletas →
            </Link>
            <Link href="http://localhost:8000/docs" target="_blank" className="text-sm text-white/40 hover:text-yellow-400 transition-colors">
              API Swagger →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}