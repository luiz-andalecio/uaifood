// Página inicial com seções básicas (hero + destaques)
import { useAuth } from "../contexts/AuthContext"
import { NavLink } from 'react-router-dom'
import { UtensilsCrossed, ArrowRight } from 'lucide-react'

export default function Home() {
  const { token } = useAuth()
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-yellow-100 to-red-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-yellow-600 font-medium mb-2">Bem-vindo ao UAIFood</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Sabor de Minas, <span className="text-red-500">na palma da mão</span>
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl">
            Peça suas refeições favoritas com facilidade e receba na mesa.
          </p>
          <div className="mt-8 flex gap-4">
            <NavLink to="/cardapio">
              <div className="px-5 py-3 rounded bg-yellow-500 text-white inline-flex items-center gap-2">
                <UtensilsCrossed size={18} /> Ver Cardápio
              </div>
            </NavLink>
            {!token && (
              <a className="px-5 py-3 rounded border border-yellow-500 text-yellow-700 inline-flex items-center gap-2" href="/cadastro">
                Criar Conta <ArrowRight size={18} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Destaques do cardápio */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Explore Nosso <span className="text-red-500">Cardápio</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['Acompanhamentos', 'Bebidas', 'Entradas', 'Pratos Principais', 'Sobremesas'].slice(0, 6).map((t) => (
              <a key={t} href="/cardapio" className="p-6 rounded-xl border hover:shadow bg-white">
                <h3 className="font-semibold">{t}</h3>
                <p className="text-sm text-gray-600">Clique para ver todos</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
