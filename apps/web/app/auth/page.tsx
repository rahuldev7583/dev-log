'use client';
import React, { useState } from 'react';
import { Header } from '../components/Header';
import Signup from '../components/Signup';
import Login from '../components/Login';

const AuthPage = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className='bg-black h-screen text-white'>
      <Header />

      {!showSignup && (
        <>
          <Login />
          <button
            className='cursor-pointer ml-[48%]'
            type='button'
            onClick={() => setShowSignup(true)}
          >
            Signup
          </button>
        </>
      )}

      {showSignup && (
        <>
          <Signup />
          <button
            className='cursor-pointer ml-[48%]'
            type='button'
            onClick={() => setShowSignup(false)}
          >
            Login
          </button>
        </>
      )}
    </div>
  );
};

export default AuthPage;
