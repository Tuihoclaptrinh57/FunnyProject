'use client';
import { useState } from 'react';
import { register } from '@/lib/api/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try { const res = await register(email, password, displayName); setMsg(`Registered id=${res.id}`); } catch (err:any){ setMsg(err.message); }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Register - smart.tobi</h1>
      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        <input className="w-full border p-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input className="w-full border p-2" placeholder="displayName" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
        <button className="w-full bg-black text-white p-2">Register</button>
      </form>
      <p className="mt-4 text-sm">{msg}</p>
    </div>
  );
}
