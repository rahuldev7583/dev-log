'use client';
import React from 'react';
import Link from 'next/link';
import { Header } from './components/Header';

export const Landing = () => {
  return (
    <div className='bg-black h-screen text-white '>
      <Header />

      <div className='text-center mt-10'>
        <Link className='text-2xl font-medium' href={'/auth'}>
          Login
        </Link>
        <br />

        <button className='text-2xl font-medium cursor-pointer mt-8'>
          Sign in with Google
        </button>

        <br />
        <button className='text-2xl font-medium cursor-pointer mt-8'>
          Sign in with Github
        </button>
      </div>
    </div>
  );
};
