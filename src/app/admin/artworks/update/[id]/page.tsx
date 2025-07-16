import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';

import ArtworkUpdateForm from './ArtworkUpdateForm';

async function ArtworkUpdate({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <ArtworkUpdateForm id={params.id} />
    </ProtectedRoute>
  );
}

export default ArtworkUpdate;
