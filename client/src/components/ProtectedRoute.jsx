import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, role, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on user role
    const dashboardPath = user.role === 'supplier' ? '/dashboard/supplier' : '/dashboard/vendor';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute; 