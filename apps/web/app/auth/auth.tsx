'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUser } from '../dashboard/dashboard';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { Navbar } from '../components/Navbar';

const AuthPage = () => {
  const router = useRouter();
  const [showSignup, setShowSignup] = useState(false);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const searchParams = useSearchParams();
  const via = searchParams.get('via');
  const token = searchParams.get('token');

  const handleGoogle = () => {
    if (via) {
      localStorage.setItem('via', via);
    }

    window.location.href = `${SERVER_URL}/api/auth/google`;
  };

  const handleGithub = async () => {
    if (via) {
      localStorage.setItem('via', via);
    }
    window.location.href = `${SERVER_URL}/api/auth/github`;
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken') || '';
    if (authToken) {
      getUser(authToken).then((res) => {
        if (res.user) {
          router.push('/dashboard');
        }
      });
    }
  }, [router]);

  return (
    <div className='bg-zinc-950 min-h-screen text-white font-sans'>
      <Navbar />

      <div className='max-w-md mx-auto pt-20 px-6 '>
        <div className='bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl'>
          <div className='flex border border-white/10 rounded-3xl p-1 mb-8 bg-zinc-950'>
            <button
              onClick={() => setShowSignup(false)}
              className={`flex-1 py-3 text-sm font-medium rounded-3xl transition-all cursor-pointer ${
                !showSignup
                  ? 'bg-emerald-500 text-white shadow-inner'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className={`flex-1 py-3 text-sm font-medium rounded-3xl transition-all cursor-pointer ${
                showSignup
                  ? 'bg-emerald-500 text-white shadow-inner'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {!showSignup ? <Login /> : <Signup />}

          <div className='my-8'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-white/10'></div>
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-zinc-900 px-4 text-zinc-400'>
                  or continue with
                </span>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <button
              onClick={handleGoogle}
              className='flex items-center justify-center gap-x-3 bg-white hover:bg-zinc-100 text-zinc-950 py-3.5 rounded-3xl font-medium transition-all shadow-inner border border-white/10 cursor-pointer'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
              >
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.25 1.22-.98 2.27-2.07 2.96v2.6h3.36c1.97-1.81 3.1-4.48 3.1-7.82z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.36-2.6c-.94.63-2.14.99-3.92.99-3.01 0-5.57-2.03-6.48-4.76H1.74v2.98C3.56 20.3 7.5 23 12 23z'
                />
                <path
                  fill='#FBBC05'
                  d='M5.52 14.53c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18V7.2H1.74C1.25 8.55.99 10.05.99 12s.26 3.45.75 4.8l3.78-2.95z'
                />
                <path
                  fill='#EA4335'
                  d='M12 4.95c1.69 0 3.22.58 4.41 1.72l3.3-3.3C17.46 1.78 14.97.99 12 .99 7.5.99 3.56 3.7 1.74 7.2l3.78 2.95c.91-2.73 3.47-4.76 6.48-4.76z'
                />
              </svg>
              <span className='text-sm'>Google</span>
            </button>

            <button
              onClick={handleGithub}
              className='flex items-center justify-center gap-x-3 bg-zinc-800 hover:bg-zinc-700 text-white py-3.5 rounded-3xl font-medium transition-all border border-white/10 cursor-pointer'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58 0-.29-.01-1.06-.02-2.08-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.21.09 1.85 1.24 1.85 1.24 1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.62-2.67-.3-5.48-1.34-5.48-5.96 0-1.32.47-2.4 1.24-3.24-.12-.3-.54-1.54.12-3.21 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.14 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.67.24 2.91.12 3.21.77.84 1.24 1.92 1.24 3.24 0 4.63-2.81 5.66-5.49 5.96.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z' />
              </svg>
              <span className='text-sm'>GitHub</span>
            </button>
          </div>
        </div>

        <p className='text-center text-xs text-zinc-500 mt-8'>
          100% private • Your coding data never leaves your machine until you
          choose to sync
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
