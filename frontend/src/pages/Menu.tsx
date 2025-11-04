// Pagina de Cardapio com abas simples
import { useEffect, useState } from 'react'

// tipo basico de item e categoria
type Item = { id: string; name: string; price: number }
type Category = { id: string; name: string; items: Item[] }

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([])

  // carrega dados da API publica
  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
  <h1 className="text-4xl font-extrabold mb-2 text-center">Nosso Cardápio</h1>
      <p className="text-center text-gray-600 mb-8">Explore nossos deliciosos pratos e monte seu pedido</p>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl border bg-white p-4">
            <h3 className="font-semibold mb-2">{cat.name}</h3>
            <ul className="space-y-3">
              {cat.items?.map((it) => (
                <li key={it.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-gray-600">R$ {Number(it.price).toFixed(2)}</div>
                  </div>
                  <button className="px-4 py-2 rounded bg-yellow-500 text-white">+ Adicionar</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
