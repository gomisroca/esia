import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import BlogUpdateForm from './BlogUpdateForm';

async function BlogUpdate({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <BlogUpdateForm id={params.id} />
    </ProtectedRoute>
  );
}

export default BlogUpdate;
