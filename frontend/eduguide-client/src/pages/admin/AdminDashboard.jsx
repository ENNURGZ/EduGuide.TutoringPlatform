import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2, Loader2, ShieldCheck, User, Check } from 'lucide-react';
import { getListings, updateListing, deleteListing } from '../../api/listing';
import Layout from '../../components/Layout';

const AdminDashboard = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const role = localStorage.getItem('role');

    const fetchListings = async () => {
        setLoading(true);                    //loading
        try {
            const params = { PageSize: 100 };
            const data = await getListings(params);
            setListings(data);
        } catch (error) {
            console.error("Dashboard listing fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bu ilanı sistemden kalıcı olarak silmek istediğinize emin misiniz?")) return;
        try {
            await deleteListing(id);
            setListings(prev => prev.filter(l => l.id !== id));
        } catch (error) {
            alert("Silme işlemi başarısız oldu: " + (error.response?.data || error.message));
        }
    };

    const handleApprove = async (listing) => {
        if (!window.confirm(`"${listing.title}" ilanını yayınlamak istiyor musunuz?`)) return;
        try {
            await updateListing(listing.id, {
                title: listing.title,
                description: listing.description,
                price: listing.price,
                status: 'Published'
            });
            setListings(prev => prev.map(l => l.id === listing.id ? { ...l, status: 'Published' } : l));
        } catch (error) {
            console.error("Approve error", error);
            alert("Onaylama işlemi başarısız oldu: " + (error.response?.data || error.message));
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    return (
        <Layout>
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-gray-900">Yönetici Paneli</h1>
                        <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-gray-500 mt-1">
                        Sistemdeki tüm ilanları ({listings.length}) yönetiyorsunuz.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"> {/*card*/}
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
                        Veriler yükleniyor...
                    </div>
                ) : listings.length > 0 ? (/*veri var mı*/
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">İlan Başlığı</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Eğitmen</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Fiyat</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {listings.map(listing => (/*her ilan için */
                                    <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="font-medium text-gray-900 line-clamp-1 max-w-xs" title={listing.title}>{listing.title}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                                    {listing.tutorName?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-gray-600 text-sm whitespace-nowrap">{listing.tutorName}</span>
                                            </div>
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
                                                {listing.status !== 'Published' && (
                                                    <button
                                                        onClick={() => handleApprove(listing)}
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Yayınla (Onayla)"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
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
                                                    title="Bu ilanı kalıcı olarak sil"
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
                    <div className="p-16 text-center text-gray-500">
                        Sistemde henüz hiç ilan yok.
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminDashboard;
