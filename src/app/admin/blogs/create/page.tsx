import React from 'react';

import ProtectedRoute from '@/app/_components/ProtectedRoute';

import BlogCreateForm from './BlogCreateForm';

async function BlogCreate() {
  return (
    <ProtectedRoute>
      <BlogCreateForm />
    </ProtectedRoute>
  );
}

export default BlogCreate;
