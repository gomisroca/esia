import React from 'react';
import ArtworkUpdateForm from './ArtworkUpdateForm';
import ProtectedRoute from '@/app/_components/ProtectedRoute';

async function ArtworkUpdate({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <ArtworkUpdateForm id={params.id} />
    </ProtectedRoute>
  );
}

export default ArtworkUpdate;
