import React, { Suspense } from 'react';

import Loader from '../components/Loader';
import AuthPage from './auth';

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <AuthPage />
    </Suspense>
  );
};

export default page;
