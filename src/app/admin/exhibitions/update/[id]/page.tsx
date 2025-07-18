import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';

import ExhibitionUpdateForm from './ExhibitionUpdateForm';

async function ExhibitionUpdate({ params }: { params: Promise<{ id: string }> }) {
  const paramsData = await params;
  return (
    <ProtectedRoute>
      <ExhibitionUpdateForm id={paramsData.id} />
    </ProtectedRoute>
  );
}

export default ExhibitionUpdate;
