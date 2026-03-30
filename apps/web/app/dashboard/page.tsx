import React, { Suspense } from 'react';
import Dashboard from './dashboard';
import Loader from '../components/Loader';

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Dashboard />
    </Suspense>
  );
};

export default page;
