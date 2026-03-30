'use client';

import React from 'react';

const Loader = () => {
  return (
    <div className='bg-zinc-950 text-white min-h-screen flex items-center justify-center font-sans'>
      <div className='flex flex-col items-center'>
        <i
          className='fa-solid fa-spinner text-8xl text-emerald-400 animate-spin'
          style={{ animationDuration: '0.9s' }}
        />
      </div>
    </div>
  );
};

export default Loader;
