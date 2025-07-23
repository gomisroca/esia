import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';

import ArtistCreateForm from './ArtistCreateForm';

async function ArtistCreate() {
  return (
    <ProtectedRoute>
      <ArtistCreateForm />
    </ProtectedRoute>
  );
}

export default ArtistCreate;
