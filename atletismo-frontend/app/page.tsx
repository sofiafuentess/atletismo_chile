import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            ATLETISMO <span className="text-yellow-400">CHILE</span>
          </h1>
          <p className="text-xs text-white/40 mt-0.5 tracking-widest uppercase">
            Plataforma Nacional de Rendimiento
          </p>
        </div>
        <nav className="flex gap-6 text-sm text-white/60">
          <Link href="/rankings" className="hover:text-white transition-colors">
            Rankings
          </Link>
          <Link href="/atletas" className="hover:text-white transition-colors">
            Atletas
          </Link>
          <Link href="/competencias" className="hover:text-white transition-colors">
            Competencias
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-8 py-24 max-w-4xl">
        <p className="text-yellow-400 text-sm tracking-widest uppercase mb-4">
          Temporada 2026
        </p>
        <h2 className="text-6xl font-black tracking-tighter leading-none mb-6">
          RENDIMIENTO<br />
          <span className="text-white/20">NACIONAL</span>
        </h2>
        <p className="text-white/50 text-lg max-w-xl leading-relaxed">
          Registros, rankings y marcas personales del atletismo chileno.
          Desde categoría U8 hasta adulto.
        </p>
        <div className="flex gap-4 mt-10">
          <Link
            href="/rankings"
            className="bg-yellow-400 text-black px-6 py-3 font-bold text-sm tracking-wide hover:bg-yellow-300 transition-colors"
          >
            VER RANKINGS
          </Link>
          <Link
            href="/atletas"
            className="border border-white/20 px-6 py-3 text-sm text-white/60 hover:text-white hover:border-white/40 transition-colors"
          >
            BUSCAR ATLETA
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="px-8 pb-24 grid grid-cols-3 gap-px max-w-2xl">
        {[
          { label: "Pruebas registradas", value: "26" },
          { label: "Categorías", value: "10" },
          { label: "Temporada activa", value: "2026" },
        ].map((stat) => (
          <div key={stat.label} className="border border-white/10 p-6">
            <div className="text-3xl font-black text-yellow-400">{stat.value}</div>
            <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}