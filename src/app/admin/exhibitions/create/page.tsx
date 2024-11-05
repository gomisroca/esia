import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import ExhibitionCreateForm from './ExhibitionCreateForm';

async function ExhibitionCreate() {
  return (
    <ProtectedRoute>
      <ExhibitionCreateForm />
    </ProtectedRoute>
  );
}

export default ExhibitionCreate;
