import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, Loader2, ShieldCheck, User } from 'lucide-react';
import { getListings, deleteListing } from '../../api/listing';
import Layout from '../../components/Layout';

const MyListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('name');

    const fetchListings = async () => {
        setLoading(true);
        try {
            const params = { PageSize: 100 };
            if (role === 'Tutor') {
                params.TutorId = userId;
            }

            const data = await getListings(params);
            setListings(data);
        } catch (error) {
            console.error("Dashboard listing fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bu ilanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
        try {
            await deleteListing(id);
            setListings(prev => prev.filter(l => l.id !== id));
        } catch (error) {
            alert("Silme işlemi başarısız oldu: " + (error.response?.data || error.message));
        }
    };

    useEffect(() => {
        fetchListings();
    }, [userId]);

    return (
        <Layout>
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-gray-900">İlanlarım</h1>
                    </div>
                    <p className="text-gray-500 mt-1">
                        Hoşgeldin {userName}, ilanlarını buradan yönetebilirsin.
                    </p>
                </div>

                <Link to="/create-listing" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all">
                    <Plus className="w-5 h-5" />
                    Yeni İlan Oluştur
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
                        Veriler yükleniyor...
                    </div>
                ) : listings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">İlan Başlığı</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Fiyat</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {listings.map(listing => (
                                    <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="font-medium text-gray-900 line-clamp-1 max-w-xs" title={listing.title}>{listing.title}</div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-600 text-sm">{listing.categoryName || '-'}</td>
                                        <td className="px-6 py-5 font-bold text-gray-900">{listing.price} ₺</td>
                                        <td className="px-6 py-5">
                                            {listing.status === 'Published' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    Yayında
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                    Taslak
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/listing/edit/${listing.id}`)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(listing.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Henüz İlanınız Yok
                        </h3>
                        <p className="text-gray-500 mb-6">İlk ders ilanınızı oluşturarak öğrencilere ulaşmaya başlayın.</p>
                        <Link to="/create-listing" className="text-indigo-600 font-bold hover:underline">Hemen Oluştur</Link>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyListings;
