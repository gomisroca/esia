import React from 'react';
import ArtworkCreateForm from './ArtworkCreateForm';
import ProtectedRoute from '@/app/_components/ProtectedRoute';

async function ArtworkCreate() {
  return (
    <ProtectedRoute>
      <ArtworkCreateForm />
    </ProtectedRoute>
  );
}

export default ArtworkCreate;
