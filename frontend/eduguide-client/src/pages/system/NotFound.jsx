import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center">
                <div className="inline-flex p-4 bg-indigo-50 rounded-full mb-6">
                    <FileQuestion className="w-16 h-16 text-indigo-600" />
                </div>
                <h1 className="text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">404</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Sayfa Bulunamadı</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir. Lütfen adresi kontrol edin.
                </p>
                <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200">
                    <Home className="w-5 h-5" />
                    Ana Sayfa
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
