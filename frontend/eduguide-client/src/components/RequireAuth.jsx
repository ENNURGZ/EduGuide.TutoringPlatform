import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
    return <Outlet />;
};

export default RequireAuth;
