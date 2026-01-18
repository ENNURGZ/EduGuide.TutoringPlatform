import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Check, X, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getRequests, updateRequestStatus } from '../../api/request';
import Layout from '../../components/Layout';

const TutorRequests = () => {
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

    useEffect(() => {
        fetchRequests();
    }, []);

    const [confirmModal, setConfirmModal] = useState({ show: false, type: null, requestId: null, title: '', message: '' });

    const openConfirmModal = (type, requestId) => {
        if (type === 'accept') {
            setConfirmModal({
                show: true,
                type: 'accept',
                requestId,
                title: 'Ders Talebini Onayla',
                message: 'Bu ders talebini onaylamak istediğinize emin misiniz? Onayladığınızda öğrenci ile mesajlaşma başlatılacaktır.'
            });
        } else if (type === 'reject') {
            setConfirmModal({
                show: true,
                type: 'reject',
                requestId,
                title: 'Ders Talebini Reddet',
                message: 'Bu ders talebini reddetmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
            });
        }
    };

    const confirmAction = async () => {
        if (!confirmModal.requestId) return;

        const status = confirmModal.type === 'accept' ? 'Accepted' : 'Rejected';
        await handleUpdateStatus(confirmModal.requestId, status);
        setConfirmModal({ show: false, type: null, requestId: null, title: '', message: '' });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold shadow-sm"><Clock className="w-3.5 h-3.5" /> Bekliyor</span>;
            case 'Accepted':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold shadow-sm"><CheckCircle className="w-3.5 h-3.5" /> Onaylandı</span>;
            case 'Rejected':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold shadow-sm"><XCircle className="w-3.5 h-3.5" /> Reddedildi</span>;
            case 'Cancelled':
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-bold shadow-sm"><XCircle className="w-3.5 h-3.5" /> İptal Edildi</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gelen Ders Talepleri</h1>
                <p className="text-gray-500 mt-1">
                    Öğrencilerden gelen ders taleplerini yönetin ve yanıtlayın.
                </p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                        <span className="text-gray-500 font-medium">Talepler Yükleniyor...</span>
                    </div>
                ) : requests.length > 0 ? (
                    requests.map(req => (
                        <div key={req.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                {/* Left: Info */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between md:justify-start md:items-center gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                                {(req.student?.name || 'Ö').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                    Öğrenci: {req.student?.name || 'İsimsiz'}
                                                </h3>
                                                <p className="text-xs text-gray-400 font-medium">
                                                    {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="md:hidden">
                                            {getStatusBadge(req.status)}
                                        </div>
                                    </div>

                                    <div className="pl-0 md:pl-14">
                                        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Ders:</span>
                                            <span className="text-sm font-semibold text-gray-800">{req.listingTitle}</span>
                                        </div>

                                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-50/50 relative group">
                                            <MessageCircle className="w-4 h-4 text-indigo-300 absolute top-4 left-3" />
                                            <p className="text-gray-700 text-sm leading-relaxed pl-6 italic">
                                                "{req.message}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex flex-col items-end gap-3 w-full md:w-auto min-w-[140px]">
                                    <div className="hidden md:block mb-2">
                                        {getStatusBadge(req.status)}
                                    </div>

                                    {req.status === 'Pending' && (
                                        <div className="flex flex-row md:flex-col gap-2 w-full">
                                            <button
                                                onClick={() => openConfirmModal('accept', req.id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-100 active:scale-95"
                                            >
                                                <Check className="w-4 h-4" /> Onayla
                                            </button>
                                            <button
                                                onClick={() => openConfirmModal('reject', req.id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-xl font-bold text-sm transition-all active:scale-95"
                                            >
                                                <X className="w-4 h-4" /> Reddet
                                            </button>
                                        </div>
                                    )}

                                    {req.status === 'Accepted' && (
                                        <button
                                            onClick={() => navigate(`/messages?requestId=${req.id}`)}
                                            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-200 active:scale-95 animate-in fade-in zoom-in"
                                        >
                                            <MessageCircle className="w-4 h-4" /> Mesaj Gönder
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-80 bg-white rounded-3xl border border-dashed border-gray-200 text-center p-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Talep Yok</h3>
                        <p className="text-gray-500 max-w-sm">
                            Henüz hiçbir öğrenci ders talebinde bulunmadı. İlanlarınızı güncel tutarak daha fazla öğrenciye ulaşabilirsiniz.
                        </p>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <h2 className={`text-xl font-bold mb-2 ${confirmModal.type === 'accept' ? 'text-indigo-600' : 'text-red-600'}`}>
                            {confirmModal.title}
                        </h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {confirmModal.message}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={confirmAction}
                                className={`flex-1 py-3 font-bold rounded-xl text-white shadow-lg transition-all active:scale-95 ${confirmModal.type === 'accept'
                                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                                    : 'bg-red-500 hover:bg-red-600 shadow-red-200'
                                    }`}
                            >
                                {confirmModal.type === 'accept' ? 'Evet, Onayla' : 'Evet, Reddet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default TutorRequests;
