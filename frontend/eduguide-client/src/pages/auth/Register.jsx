import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, AlertCircle, Loader2, ArrowLeft, GraduationCap } from 'lucide-react';
import { register } from '../../api/auth';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student'//varsayılan
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Kayıt başarısız. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-indigo-100 border border-gray-100">
                <div>
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-indigo-600 mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Geri Dön
                    </Link>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center">
                        Hesap Oluştur
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        Dakikalar içinde aramıza katılın
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600 font-medium">{typeof error === 'string' ? error : 'Bilinmeyen hata'}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Ad Soyad</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Adresi</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="ornek@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Şifre</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="En az 6 karakter"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Hesap Türü</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'Student' })}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${formData.role === 'Student'
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    <GraduationCap className={`w-8 h-8 mb-2 ${formData.role === 'Student' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <span className="font-bold text-sm">Öğrenci</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'Tutor' })}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${formData.role === 'Tutor'
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    <Briefcase className={`w-8 h-8 mb-2 ${formData.role === 'Tutor' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <span className="font-bold text-sm">Eğitmen</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Hesap Oluştur'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Zaten hesabınız var mı?{' '}
                        <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                            Giriş Yapın
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
