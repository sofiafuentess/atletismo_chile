"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await login(email, password)
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("rol", data.rol)
      localStorage.setItem("nombre", data.nombre)
      router.push("/admin")
    } catch {
      setError("Email o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black tracking-tight">
            ATLETISMO <span className="text-yellow-400">CHILE</span>
          </h1>
          <p className="text-white/30 text-xs tracking-widest uppercase mt-1">
            Panel de administración
          </p>
        </div>

        {/* Form */}
        <div className="border border-white/10 p-8">
          <div className="mb-6">
            <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
              placeholder="admin@atletismo.cl"
            />
          </div>

          <div className="mb-8">
            <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="mb-6 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-3 font-black text-sm tracking-wide hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {loading ? "INGRESANDO..." : "INGRESAR"}
          </button>
        </div>
      </div>
    </main>
  )
}