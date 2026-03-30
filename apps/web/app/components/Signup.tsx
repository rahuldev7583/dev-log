'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const router = useRouter();
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/signup`, {
        name: user.name,
        email: user.email,
        password: user.password,
      });

      const token = res.data.token;
      if (token) {
        localStorage.setItem('authToken', token);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Signup failed', error);
      alert('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <label className='text-sm font-medium text-zinc-400 block mb-1'>
          Full name
        </label>
        <input
          type='text'
          name='name'
          value={user.name}
          onChange={handleChange}
          className='w-full bg-white/10 border border-white/20 focus:border-emerald-400 rounded-2xl px-4 py-3 text-white placeholder-zinc-500 outline-none transition-all'
          placeholder='Rahul Dev'
        />
      </div>

      <div>
        <label className='text-sm font-medium text-zinc-400 block mb-1'>
          Email
        </label>
        <input
          type='email'
          name='email'
          value={user.email}
          onChange={handleChange}
          className='w-full bg-white/10 border border-white/20 focus:border-emerald-400 rounded-2xl px-4 py-3 text-white placeholder-zinc-500 outline-none transition-all'
          placeholder='you@email.com'
        />
      </div>

      <div>
        <label className='text-sm font-medium text-zinc-400 block mb-1'>
          Password
        </label>
        <input
          type='password'
          name='password'
          value={user.password}
          onChange={handleChange}
          className='w-full bg-white/10 border border-white/20 focus:border-emerald-400 rounded-2xl px-4 py-3 text-white placeholder-zinc-500 outline-none transition-all'
          placeholder='Create a strong password'
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className='w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-4 rounded-3xl transition-all flex items-center justify-center gap-x-2 disabled:opacity-70 cursor-pointer'
      >
        {loading ? (
          'Creating account...'
        ) : (
          <>
            Create account
            <i className='fa-solid fa-arrow-right' />
          </>
        )}
      </button>

      <p className='text-xs text-zinc-500 text-center'>
        By signing up you agree to our
        <span className='text-emerald-400 cursor-pointer'>Terms</span> and{' '}
        <span className='text-emerald-400 cursor-pointer'>Privacy</span>
      </p>
    </div>
  );
};

export default Signup;
