import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getListingById } from '../../api/listing';
import { createRequest } from '../../api/request';
import Layout from '../../components/Layout';
import { MapPin, Globe, Clock, Star, Share2, Heart, MessageCircle, Calendar, ShieldCheck, ArrowLeft, X, Loader2 } from 'lucide-react';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('//')) return url;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5024';
    return `${baseUrl}${url}`;
};
const ListingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestMessage, setRequestMessage] = useState('');
    const [requestSending, setRequestSending] = useState(false);

    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getListingById(id);
                setListing(data);
                if (data.images && data.images.length > 0) {
                    setActiveImage(getImageUrl(data.images[0]));
                }
            } catch (err) {
                console.error("Listing detail error", err);
                setError("İlan detayları alınamadı.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleOpenRequestModal = () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token) {
            alert("Ders talebi göndermek için giriş yapmalısınız.");
            navigate('/login');
            return;
        }

        if (role === 'Tutor') {
            alert("Eğitmenler ders talebi gönderemez.");
            return;
        }

        if (role === 'Admin') {
            alert("Adminler ders talebi gönderemez.");
            return;
        }

        setIsModalOpen(true);
    };

    const handleSendRequest = async (e) => {
        e.preventDefault();
        setRequestSending(true);
        try {
            await createRequest({
                listingId: parseInt(id),
                message: requestMessage
            });
            alert("Ders talebiniz başarıyla gönderildi! Eğitmen onayladığında mesajlaşma başlayacaktır.");
            setIsModalOpen(false);
            setRequestMessage('');
            navigate('/requests');
        } catch (error) {
            console.error("Talep gönderme hatası", error);
            alert("Talep gönderilemedi: " + (error.response?.data || error.message));
        } finally {
            setRequestSending(false);
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
            </div>
        </Layout>
    );

    if (error || !listing) return (
        <Layout>
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Hata</h2>
                <p className="text-gray-500 mt-2">{error || "İlan bulunamadı."}</p>
                <Link to="/listings" className="text-indigo-600 font-bold mt-4 inline-block hover:underline">
                    İlanlara Dön
                </Link>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="mb-6">
                <Link to="/listings" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Tüm İlanlara Dön
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="rounded-3xl overflow-hidden shadow-lg h-[400px] relative group bg-gray-100">
                            <img
                                src={activeImage}
                                alt={listing.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {listing.images.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setActiveImage(getImageUrl(img))}
                                    className={`h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activeImage === getImageUrl(img) ? 'border-indigo-600 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={getImageUrl(img)}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase rounded-full tracking-wider">
                                        {listing.categoryName || 'Özel Ders'}
                                    </span>
                                    {listing.mode && (
                                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider flex items-center gap-1 ${listing.mode === 'Online' ? 'bg-indigo-100 text-indigo-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {listing.mode === 'Online' ? <Globe className="w-3 h-3" /> : <i className="lucide-users w-3 h-3"></i>}
                                            {listing.mode === 'Online' ? 'Online' : 'Yüz Yüze'}
                                        </span>
                                    )}

                                </div>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{listing.title}</h1>
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                    <span>Doğrulanmış Eğitmen: <span className="text-gray-900">{listing.tutorName}</span></span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-extrabold text-indigo-600">{listing.price} ₺</div>
                                <span className="text-sm text-gray-400 font-medium">/Saat</span>
                            </div>
                        </div>

                        <hr className="border-gray-100 my-8" />

                        <div className="prose prose-indigo max-w-none text-gray-600">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Ders Hakkında</h3>
                            <p className="leading-relaxed whitespace-pre-line">{listing.description}</p>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg shadow-indigo-100 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Ders Talep Et</h3>
                        <p className="text-sm text-gray-500 mb-6">Bu eğitmen ile iletişime geçmek ve ders planlamak için talep oluşturun.</p>
                        <div className="space-y-4">
                            <button
                                onClick={handleOpenRequestModal}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
                            >
                                Talep Gönder
                            </button>
                            <button className="w-full py-3 bg-white border-2 border-gray-100 hover:border-indigo-100 text-gray-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                <MessageCircle className="w-5 h-5 text-gray-400" />
                                Mesaj Gönder
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Talep Oluştur</h2>
                        <p className="text-sm text-gray-500 mb-6">{listing.tutorName} isimli eğitmene mesajınızı iletin.</p>

                        <form onSubmit={handleSendRequest}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Mesajınız</label>
                                <textarea
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-32"
                                    placeholder="Merhaba, matematik dersi için uygunluk durumunuzu öğrenmek istiyorum..."
                                    value={requestMessage}
                                    onChange={(e) => setRequestMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={requestSending}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                            >
                                {requestSending && <Loader2 className="w-5 h-5 animate-spin" />}
                                Gönder
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ListingDetails;
