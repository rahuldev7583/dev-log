'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Navbar } from '../../components/Navbar';

const AuthPage = () => {
  const [authStatus, setAuthStatus] = useState(false);
  const router = useRouter();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const getToken = async (authToken: string) => {
    const res = await axios.get(`${SERVER_URL}/api/auth/extension/authorize`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res;
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken') || '';
    if (authToken) {
      getToken(authToken).then((res) => {
        console.log({ res });

        const token = res.data.extToken;

        setAuthStatus(true);
        setTimeout(() => {
          router.push(
            `vscode://rahuldevkai75.devlog-extension/callback?extToken=${token}`,
          );
        }, 2000);
      });
    } else {
      router.push('/auth?via=extension', {});
    }
  }, []);

  return (
    <div className='bg-zinc-950 text-white min-h-screen font-sans'>
      <Navbar />

      <div className='max-w-screen-2xl mx-auto px-8 pt-8 pb-24 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]'>
        <div className='text-center max-w-md mb-12'>
          <h1
            className='text-5xl font-semibold tracking-tighter leading-none'
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Authorize Extension
          </h1>
          <p className='text-zinc-400 text-xl mt-2'>
            Connecting DevLog to your VS Code
          </p>
        </div>

        {!authStatus ? (
          <div className='w-full max-w-md bg-zinc-900 border border-white/5 hover:border-emerald-400/30 rounded-3xl p-8 text-center transition-colors'>
            <div className='flex justify-center mb-6'>
              <div className='text-emerald-400 font-mono text-xl animate-pulse'>
                Authorizing…
              </div>
            </div>
            <p className='text-zinc-400'>
              Verifying your session and generating extension token
            </p>

            <div className='mt-8 h-2 bg-zinc-800 rounded-full overflow-hidden'>
              <div
                className='bg-emerald-400 h-2 rounded-full transition-all animate-[progress_1.8s_linear_infinite]'
                style={{ width: '66%' }}
              />
            </div>

            <p className='text-xs text-zinc-500 mt-6 font-mono'>
              This usually takes just a few seconds
            </p>
          </div>
        ) : (
          <div className='w-full max-w-md bg-zinc-900 border border-emerald-400/30 rounded-3xl p-8 text-center'>
            <div className='mx-auto w-16 h-16 bg-emerald-400/10 rounded-3xl flex items-center justify-center mb-6'>
              <i className='fa-solid fa-circle-check text-6xl text-emerald-400' />
            </div>

            <h3 className='text-3xl font-semibold text-emerald-400 mb-1'>
              Authentication successful!
            </h3>
            <p className='text-zinc-300 text-lg'>
              Your VS Code extension is now connected to DevLog.
            </p>

            <div className='mt-8 text-zinc-400'>
              <p>You will be redirected to the VS Code window shortly.</p>
              <p className='text-xs text-zinc-500 mt-6'>
                You may safely close this page.
              </p>
            </div>

            <div className='mt-10 h-1 bg-emerald-400/20 rounded-full w-3/4 mx-auto' />
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
