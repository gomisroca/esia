import ProtectedRoute from '../_components/ProtectedRoute';

const AdminDashboard = () => {
  return (
    <ProtectedRoute>
      <div>
        <h1>Admin Dashboard</h1>
        {/* Your admin content goes here */}
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
