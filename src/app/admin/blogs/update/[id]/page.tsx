import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';

import BlogUpdateForm from './BlogUpdateForm';

async function BlogUpdate({ params }: { params: Promise<{ id: string }> }) {
  const paramsData = await params;
  return (
    <ProtectedRoute>
      <BlogUpdateForm id={paramsData.id} />
    </ProtectedRoute>
  );
}

export default BlogUpdate;
