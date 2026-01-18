import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Erişim Yetkiniz Yok</h1>
                <p className="text-gray-500 mb-8">
                    Bu sayfayı görüntülemek için gerekli izinlere sahip değilsiniz. Lütfen giriş yapın veya yöneticinizle iletişime geçin.
                </p>
                <Link to="/" className="inline-flex items-center justify-center w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Ana Sayfaya Dön
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
