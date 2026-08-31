// SmartTobi Login - RSC + Server Actions
'use client';
import { useState } from 'react';
import { login } from '@/lib/api/client';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@smart.tobi');
  const [password, setPassword] = useState('123456');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await login(email, password);
      localStorage.setItem('accessToken', res.accessToken);
      setMsg(`Login ok userId=${res.userId}`);
    } catch (err: any) { setMsg(err.message); }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Login - smart.tobi</h1>
      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        <input className="w-full border p-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-black text-white p-2">Login</button>
      </form>
      <p className="mt-4 text-sm">{msg}</p>
    </div>
  );
}
