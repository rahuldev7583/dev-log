'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Signup = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log('Signup');

    const res = await axios.post('http://localhost:5000/api/auth/signup', {
      name: user.name,
      email: user.email,
      password: user.password,
    });

    console.log({ res });

    const token = res.data.token;

    if (token) {
      console.log({ token });
      localStorage.setItem('authToken', token);

      console.log('signup successfull');

      router.push('/dashboard');
    }
  };

  return (
    <div className='text-center'>
      <label className='mt-4' htmlFor='name'>
        Full name
      </label>
      <br />
      <input
        className='bg-white mt-2 text-black'
        type='text'
        name='name'
        onChange={handleChange}
        value={user.name}
      />
      <br />
      <label htmlFor='email'>Email</label>
      <br />
      <input
        className='bg-white mt-2 text-black'
        type='text'
        name='email'
        onChange={handleChange}
        value={user.email}
      />
      <br />
      <label htmlFor='password'>Password</label>
      <br />
      <input
        className='bg-white mt-2 text-black'
        type='password'
        name='password'
        onChange={handleChange}
        value={user.password}
      />
      <br />
      <button className='cursor-pointer mt-4' onClick={handleSubmit}>
        submit
      </button>
    </div>
  );
};

export default Signup;
