import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';

import ArtworkCreateForm from './ArtworkCreateForm';

async function ArtworkCreate() {
  return (
    <ProtectedRoute>
      <ArtworkCreateForm />
    </ProtectedRoute>
  );
}

export default ArtworkCreate;
