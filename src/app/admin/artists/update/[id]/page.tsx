import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';

import ArtistUpdateForm from './ArtistUpdateForm';

async function ArtistUpdate({ params }: { params: Promise<{ id: string }> }) {
  const paramsData = await params;
  return (
    <ProtectedRoute>
      <ArtistUpdateForm id={paramsData.id} />
    </ProtectedRoute>
  );
}

export default ArtistUpdate;
