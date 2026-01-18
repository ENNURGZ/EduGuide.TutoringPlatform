import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from '../components/RequireAuth';

// Public Pages
import HomePage from '../pages/public/HomePage';
import Listings from '../pages/public/Listings';
import ListingDetails from '../pages/public/ListingDetails';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Tutor Pages
import MyListings from '../pages/tutor/MyListings';
import CreateListing from '../pages/tutor/CreateListing';
import EditListing from '../pages/tutor/EditListing';
import TutorRequests from '../pages/tutor/TutorRequests';

// Student Pages
import MyRequests from '../pages/student/MyRequests';
import Messages from '../pages/student/Messages';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import Categories from '../pages/admin/Categories';

// System Pages
import Unauthorized from '../pages/system/Unauthorized';
import NotFound from '../pages/system/NotFound';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:id" element={<ListingDetails />} />

            {/* Tutor Routes */}
            <Route element={<RequireAuth allowedRoles={['Tutor']} />}>
                <Route path="/dashboard" element={<MyListings />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route path="/tutor-requests" element={<TutorRequests />} />
            </Route>

            {/* Shared Routes (Tutor & Admin) */}
            <Route element={<RequireAuth allowedRoles={['Tutor', 'Admin']} />}>
                <Route path="/listing/edit/:id" element={<EditListing />} />
            </Route>

            {/* Student Routes */}
            <Route element={<RequireAuth allowedRoles={['Student']} />}>
                <Route path="/requests" element={<MyRequests />} />
            </Route>

            {/* Shared Routes (Student & Tutor) */}
            <Route element={<RequireAuth allowedRoles={['Student', 'Tutor']} />}>
                <Route path="/messages" element={<Messages />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<RequireAuth allowedRoles={['Admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/categories" element={<Categories />} />
            </Route>

            {/* System Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;
