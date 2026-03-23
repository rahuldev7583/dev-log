'use client';
import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log('login');

    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: user.email,
      password: user.password,
    });

    console.log({ res });
    const token = res.data.token;
    if (token) {
      console.log({ token });
      localStorage.setItem('authToken', token);

      console.log('Login successfull');

      router.push('/dashboard');
    }
  };

  return (
    <div className='text-center'>
      <label className='mt-4' htmlFor='email'>
        Email
      </label>
      <br />
      <input
        className='bg-white mt-2 text-black'
        type='text'
        name='email'
        onChange={handleChange}
        value={user.email}
      />
      <br />

      <label className='mt-4' htmlFor='password'>
        Password
      </label>
      <br />
      <input
        className='bg-white mt-2 text-black'
        type='password'
        name='password'
        onChange={handleChange}
        value={user.password}
      />
      <br />
      <button className='cursor-pointer' onClick={handleSubmit}>
        Login
      </button>
    </div>
  );
};

export default Login;
