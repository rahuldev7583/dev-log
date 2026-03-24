'use client';
import React from 'react';
import Link from 'next/link';
import { Header } from './components/Header';

export const Landing = () => {
  const handleGoogle = async () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleGithub = async () => {
    window.location.href = 'http://localhost:5000/api/auth/github';
  };

  return (
    <div className='bg-black h-screen text-white '>
      <Header />

      <div className='text-center mt-10'>
        <Link className='text-2xl font-medium' href={'/auth'}>
          Login
        </Link>
        <br />

        <button
          className='text-2xl font-medium cursor-pointer mt-8'
          onClick={handleGoogle}
        >
          Sign in with Google
        </button>

        <br />
        <button
          className='text-2xl font-medium cursor-pointer mt-8'
          onClick={handleGithub}
        >
          Sign in with Github
        </button>
      </div>
    </div>
  );
};
