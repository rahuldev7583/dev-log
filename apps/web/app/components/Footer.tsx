import React from 'react';
import Image from 'next/image';
import codingIcon from './../../public/programming.png';

const Footer = () => {
  return (
    <footer className='bg-black py-12 border-t border-white/10'>
      <div className='max-w-screen-2xl mx-auto px-8 grid grid-cols-2 md:grid-cols-5 gap-y-8'>
        <div>
          <div className='flex items-center gap-x-3 mb-6'>
            <div className='w-8 h-8 rounded-2xl flex items-center justify-center text-white text-3xl rotate-12'>
              <Image src={codingIcon} alt='coding-icon' />
            </div>
            <span
              className='text-3xl font-semibold tracking-tighter'
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Devlog
            </span>
          </div>
          <p className='text-zinc-400 text-sm'>
            Made with ❤️ for developers who want to understand their craft.
          </p>
          <div className='mt-6 flex gap-x-4 text-2xl'>
            <a
              href='https://x.com/iamrahul_dev'
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-brands fa-x-twitter' />
            </a>
            <a
              href='https://github.com/rahuldev7583/dev-log'
              target='_blank'
              rel='noreferrer'
            >
              <i className='fa-brands fa-github' />
            </a>
          </div>
        </div>

        <div>
          <p className='font-semibold mb-4'>Product</p>
          <a href='#' className='block text-zinc-400 hover:text-white mb-2'>
            Features
          </a>
          <a href='#' className='block text-zinc-400 hover:text-white mb-2'>
            Changelog
          </a>
          <a href='#' className='block text-zinc-400 hover:text-white mb-2'>
            Roadmap
          </a>
        </div>

        <div>
          <p className='font-semibold mb-4'>Community</p>
          <a
            href='https://github.com/rahuldev7583/dev-log'
            target='_blank'
            className='block text-zinc-400 hover:text-white mb-2'
            rel='noreferrer'
          >
            GitHub
          </a>
          <a href='#' className='block text-zinc-400 hover:text-white mb-2'>
            Discord
          </a>
        </div>

        <div>
          <p className='font-semibold mb-4'>Resources</p>
          <a href='#' className='block text-zinc-400 hover:text-white mb-2'>
            Documentation
          </a>
          <a href='#' className='block text-zinc-400 hover:text-white mb-2'>
            Privacy
          </a>
        </div>

        <div className='md:text-right'>
          <p className='text-xs text-zinc-500'>
            © 2026 Rahul Dev • Devlog is open source
          </p>
          <p className='text-xs text-emerald-400 mt-8'>
            Built as a love letter to every late-night coding session.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
