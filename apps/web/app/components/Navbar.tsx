'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import codingIcon from './../../public/programming.png';
import { useRouter } from 'next/navigation';
import Loader from './Loader';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('authToken');
      setLoading(false);
      router.push('/');
    }, 1000);
    return;
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setToken(authToken);
    }
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <nav className='border-b border-white/10 bg-zinc-950 sticky top-0 z-50'>
      <div className='max-w-screen-2xl mx-auto px-8 py-5 flex items-center justify-between'>
        <div
          className='flex items-center gap-x-3 cursor-pointer'
          onClick={() => (token ? router.push('/dashboard') : router.push('/'))}
        >
          <div className='w-9 h-9 rounded-2xl flex items-center justify-center text-white text-2xl rotate-12'>
            <Image src={codingIcon} alt='coding-icon' />
          </div>
          <h1
            className='text-3xl font-semibold tracking-tighter'
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Devlog
          </h1>
        </div>

        <div className='hidden md:flex items-center gap-x-8 text-sm font-medium'>
          <a href='#features' className='nav-link'>
            Features
          </a>
          <a href='#how-it-works' className='nav-link'>
            How it Works
          </a>

          <a
            href='https://github.com/rahuldev7583/dev-log'
            target='_blank'
            className='nav-link flex items-center gap-x-1'
            rel='noreferrer'
          >
            <i className='fa-brands fa-github'></i> GitHub
          </a>

          <a
            href='https://marketplace.visualstudio.com/items?itemName=rahuldevkai75.devlog-extension'
            target='_blank'
            className='nav-link'
            rel='noreferrer'
          >
            VS Marketplace
          </a>
        </div>

        <div className='flex items-center gap-x-4'>
          {!token ? (
            <>
              {' '}
              <a
                href='https://marketplace.visualstudio.com/items?itemName=rahuldevkai75.devlog-extension'
                target='_blank'
                className='px-6 py-3 text-sm font-semibold bg-white text-zinc-900 rounded-2xl hover:bg-emerald-400 hover:text-white flex items-center gap-x-2'
                rel='noreferrer'
              >
                <i className='fa-brands fa-microsoft'></i>
                Install On VS Code
              </a>
              <a
                href='/auth'
                className='px-6 py-3 text-sm font-semibold border border-emerald-400 hover:bg-emerald-400 hover:text-zinc-950 rounded-2xl flex items-center gap-x-2 transition-all'
              >
                Get Started
              </a>
            </>
          ) : (
            <button
              onClick={logout}
              className='px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl text-sm font-medium flex items-center gap-x-2 transition-colors cursor-pointer'
            >
              <span>Logout</span>
              <i className='fa-solid fa-arrow-right-from-bracket' />
            </button>
          )}
          <button className='md:hidden text-2xl'>
            <i className='fa-solid fa-bars'></i>
          </button>
        </div>
      </div>
    </nav>
  );
};
