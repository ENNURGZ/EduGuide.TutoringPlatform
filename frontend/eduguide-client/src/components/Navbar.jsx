import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, User, LogOut, ShieldCheck } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token) {
            setUser({ name: 'Kullanıcı', role });
        } else {
            setUser(null);
        }
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-white shadow-md py-3' : 'bg-white/80 backdrop-blur-md shadow-sm py-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105 duration-300">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                            Edu<span className="text-indigo-600">Guide</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="font-medium text-gray-700 hover:text-indigo-600 transition-colors">Ana Sayfa</Link>
                        <Link to="/listings" className="font-medium text-gray-700 hover:text-indigo-600 transition-colors">Ders İlanları</Link>

                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {user.role === 'Admin' && (
                                    <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                        Yönetici
                                    </span>
                                )}
                                {user.role === 'Tutor' && (
                                    <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                                        Eğitmen Hesabı
                                    </span>
                                )}
                                {user.role === 'Student' && (
                                    <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                        Öğrenci Hesabı
                                    </span>
                                )}

                                {user.role === 'Admin' && (
                                    <Link to="/categories" className="font-medium text-gray-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                                        Kategoriler
                                    </Link>
                                )}
                                {user.role !== 'Admin' && (
                                    <>
                                        {user.role === 'Student' && (
                                            <Link to="/requests" className="font-medium text-gray-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                                                Taleplerim
                                            </Link>
                                        )}
                                        {user.role === 'Tutor' && (
                                            <Link to="/tutor-requests" className="font-medium text-gray-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                                                Taleplerim
                                            </Link>
                                        )}
                                        <Link to="/messages" className="font-medium text-gray-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                                            Mesajlar
                                        </Link>
                                    </>
                                )}
                                {(user.role === 'Admin') && (
                                    <Link to="/admin" className="flex items-center gap-2 font-medium text-gray-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <span>Yönetici Paneli</span>
                                    </Link>
                                )}
                                {(user.role === 'Tutor') && (
                                    <Link to="/dashboard" className="flex items-center gap-2 font-medium text-gray-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span>Panelim</span>
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                                >
                                    Çıkış Yap
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="font-bold text-gray-700 hover:text-indigo-600 transition-colors px-4">
                                    Giriş Yap
                                </Link>
                                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-200 transition-all hover:shadow-xl active:scale-95">
                                    Kayıt Ol
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col space-y-4">
                    <Link to="/" className="text-gray-700 font-medium py-2 border-b border-gray-50">Ana Sayfa</Link>
                    <Link to="/listings" className="text-gray-700 font-medium py-2 border-b border-gray-50">Ders İlanları</Link>

                    {user ? (
                        <>
                            <div className="py-2 px-2 bg-gray-50 rounded-lg mb-2">
                                <span className="text-sm text-gray-500 block mb-1">Hesap Türü:</span>
                                {user.role === 'Admin' && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                        Yönetici
                                    </span>
                                )}
                                {user.role === 'Tutor' && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                                        Eğitmen Hesabı
                                    </span>
                                )}
                                {user.role === 'Student' && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                        Öğrenci Hesabı
                                    </span>
                                )}
                            </div>

                            {user.role === 'Admin' && (
                                <Link to="/categories" className="text-gray-700 font-medium py-2 border-b border-gray-50">Kategoriler</Link>
                            )}
                            {user.role !== 'Admin' && (
                                <>
                                    {user.role === 'Student' && (
                                        <Link to="/requests" className="text-gray-700 font-medium py-2 border-b border-gray-50">Taleplerim</Link>
                                    )}
                                    {user.role === 'Tutor' && (
                                        <Link to="/tutor-requests" className="text-gray-700 font-medium py-2 border-b border-gray-50">Taleplerim</Link>
                                    )}
                                    <Link to="/messages" className="text-gray-700 font-medium py-2 border-b border-gray-50">Mesajlar</Link>
                                </>
                            )}

                            {(user.role === 'Admin') && (
                                <Link to="/admin" className="flex items-center gap-2 text-indigo-600 font-bold py-2">
                                    <ShieldCheck className="w-5 h-5" /> Yönetici Paneli
                                </Link>
                            )}
                            {(user.role === 'Tutor') && (
                                <Link to="/dashboard" className="flex items-center gap-2 text-indigo-600 font-bold py-2">
                                    <User className="w-5 h-5" /> Panelim
                                </Link>
                            )}

                            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium py-2">
                                <LogOut className="w-5 h-5" /> Çıkış Yap
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 mt-2">
                            <Link to="/login" className="w-full text-center py-3 rounded-xl border border-gray-200 text-gray-700 font-bold">
                                Giriş Yap
                            </Link>
                            <Link to="/register" className="w-full text-center py-3 rounded-xl bg-indigo-600 text-white font-bold">
                                Kayıt Ol
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
