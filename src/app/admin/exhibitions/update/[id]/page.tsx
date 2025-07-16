import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';

import ExhibitionUpdateForm from './ExhibitionUpdateForm';

async function ExhibitionUpdate({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <ExhibitionUpdateForm id={params.id} />
    </ProtectedRoute>
  );
}

export default ExhibitionUpdate;
