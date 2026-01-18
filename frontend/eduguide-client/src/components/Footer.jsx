import React from 'react';
import { BookOpen, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-gray-300 pt-10 pb-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/20">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Edu<span className="text-indigo-500">Guide</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Öğrenciler ve eğitmenleri bir araya getiren, Türkiye'nin en kapsamlı özel ders platformu.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 group">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 group">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 group">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 group">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Hızlı Erişim</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Ana Sayfa</Link></li>
                            <li><Link to="/listings" className="hover:text-indigo-400 transition-colors">Ders İlanları</Link></li>
                            <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Eğitmen Ol</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">İletişim</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                                <span>İstanbul, Türkiye</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-indigo-500" />
                                <span>+90 (000) 000 00 00</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-indigo-500" />
                                <span>info@eduguide.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; 2026 EduGuide Platform. Tüm hakları saklıdır.Ennur Gürbüz</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
                        <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
