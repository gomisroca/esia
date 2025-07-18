import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';

import ArtworkUpdateForm from './ArtworkUpdateForm';

async function ArtworkUpdate({ params }: { params: Promise<{ id: string }> }) {
  const paramsData = await params;
  return (
    <ProtectedRoute>
      <ArtworkUpdateForm id={paramsData.id} />
    </ProtectedRoute>
  );
}

export default ArtworkUpdate;
