import React from 'react';
import AdminLayout from '../../components/templates/backend/AdminLayout';

function Dashboard() {
  return (
    <AdminLayout>
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome to the administration panel.</p>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;