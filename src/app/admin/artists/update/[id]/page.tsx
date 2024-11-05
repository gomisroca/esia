import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import ArtistUpdateForm from './ArtistUpdateForm';

async function ArtistUpdate({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <ArtistUpdateForm id={params.id} />
    </ProtectedRoute>
  );
}

export default ArtistUpdate;
