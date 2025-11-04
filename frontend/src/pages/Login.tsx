import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // login simples
    const res = await fetch('http://localhost:3333/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (res.ok) {
      // comentario: apenas armazena token para testes iniciais
      localStorage.setItem('token', data.token)
      window.location.href = '/'
    } else {
      alert(data.message || 'Falha no login')
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center bg-gradient-to-br from-red-50 to-yellow-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Entrar</h1>
        <input className="w-full border rounded px-3 py-2 mb-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded px-3 py-2 mb-4" placeholder="Senha" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="w-full py-2 bg-yellow-500 text-white rounded">Entrar</button>
      </form>
    </div>
  )
}
