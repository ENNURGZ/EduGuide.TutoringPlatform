import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MessageCircle, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { getRequests, updateRequestStatus, deleteRequest } from '../../api/request';
import Layout from '../../components/Layout';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await getRequests();
            setRequests(data);
        } catch (error) {
            console.error("Requests fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateRequestStatus(id, { status: newStatus });
            setRequests(prev => prev.map(req =>
                req.id === id ? { ...req, status: newStatus } : req
            ));
        } catch (error) {
            alert("Durum güncellenemedi: " + (error.response?.data || error.message));
        }
    };

    const handleDeleteRequest = async (id) => {
        if (!window.confirm("Bu talebi silmek istediğinize emin misiniz?")) return;

        try {
            await deleteRequest(id);
            setRequests(prev => prev.filter(req => req.id !== id));
        } catch (error) {
            alert("Talep silinemedi: " + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold"><Clock className="w-3.5 h-3.5" /> Bekliyor</span>;
            case 'Accepted':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold"><CheckCircle className="w-3.5 h-3.5" /> Onaylandı</span>;
            case 'Rejected':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold"><XCircle className="w-3.5 h-3.5" /> Reddedildi</span>;
            case 'Cancelled':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold"><XCircle className="w-3.5 h-3.5" /> İptal Edildi</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Ders Taleplerim</h1>
                <p className="text-gray-500 mt-1">
                    Gönderdiğiniz ders taleplerinin durumunu takip edin.
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                            <span>Yükleniyor...</span>
                        </div>
                    </div>
                ) : requests.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {requests.map(req => (
                            <div key={req.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {req.listingTitle || 'Ders'}
                                        </h3>
                                        {getStatusBadge(req.status)}
                                    </div>
                                    <p className="text-sm font-medium text-indigo-600 mb-1">Eğitmen: {req.listing?.tutor?.name || 'İsimsiz'}</p>
                                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 inline-block max-w-2xl">
                                        "{req.message}"
                                    </p>
                                    <div className="mt-2 text-xs text-gray-400">
                                        {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {(req.status === 'Rejected' || req.status === 'Cancelled') && (
                                        <button
                                            onClick={() => handleDeleteRequest(req.id)}
                                            className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Talebi Sil"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}

                                    {req.status === 'Pending' && (
                                        <button
                                            onClick={() => handleUpdateStatus(req.id, 'Cancelled')}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors"
                                        >
                                            İptal Et
                                        </button>
                                    )}

                                    {req.status === 'Accepted' && (
                                        <button
                                            onClick={() => navigate(`/messages?requestId=${req.id}`)}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-200"
                                        >
                                            <MessageCircle className="w-4 h-4" /> Mesajlaş
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-80 text-center p-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Talep Yok</h3>
                        <p className="text-gray-500">
                            Henüz hiçbir ders talebi oluşturmadınız.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyRequests;
