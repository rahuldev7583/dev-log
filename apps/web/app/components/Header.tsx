import Image from 'next/image';
import React from 'react';
import codingIcon from '../../public/programming.png';

export const Header = () => {
  return (
    <div className='pt-10 ml-10'>
      <div className='flex'>
        <Image className='h-12 w-12' src={codingIcon} alt='coding-icon'></Image>
        <h1 className='text-4xl font-bold ml-2 mt-2'>DevLog</h1>
      </div>
    </div>
  );
};
