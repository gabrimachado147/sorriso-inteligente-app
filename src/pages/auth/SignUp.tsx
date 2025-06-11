import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 flex flex-col gap-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input className="border p-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2" type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="bg-primary text-white p-2 rounded">Criar conta</button>
    </form>
  )
}
