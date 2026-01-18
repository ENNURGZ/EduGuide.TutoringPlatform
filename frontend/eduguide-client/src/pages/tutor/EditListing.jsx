import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, DollarSign, List, FileText, CheckCircle } from 'lucide-react';
import { updateListing, getListingById } from '../../api/listing';
import { getCategories } from '../../api/category';
import Layout from '../../components/Layout';

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const backLink = role === 'Admin' ? '/admin' : '/dashboard';

    const [categories, setCategories] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState('');//form state
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [mode, setMode] = useState('Online');
    const [status, setStatus] = useState('Draft');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catData = await getCategories();
                setCategories(catData);

                const data = await getListingById(id);

                setTitle(data.title);
                setDescription(data.description);
                setPrice(data.price);
                setMode(data.mode || 'Online');
                setStatus(data.status);
            } catch (error) {
                console.error('Veri yükleme hatası', error);
                alert("İlan bilgileri yüklenemedi.");
                navigate(backLink);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateListing(id, {
                title,
                description,
                price: parseFloat(price),
                mode,
                status
            });
            alert("İlan başarıyla güncellendi.");
            navigate(backLink);
        } catch (error) {
            console.error('Güncelleme hatası', error);
            alert('Güncelleme başarısız: ' + (error.response?.data || error.message));
        } finally {
            setSaving(false);
        }
    };

    if (loadingData) return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <Link to={backLink} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Panele Dön
                </Link>

                <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-8 sm:p-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">İlanı Düzenle</h1>
                    <p className="text-gray-500 mb-8">İlan bilgilerinizi güncelleyin.</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">İlan Başlığı</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Açıklama</label>
                                <textarea
                                    required
                                    rows="6"
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Ders İşleme Şekli</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 cursor-pointer rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${mode === 'Online' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="Online"
                                        checked={mode === 'Online'}
                                        onChange={(e) => setMode(e.target.value)}
                                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold">Online</span>
                                        <span className="text-xs opacity-80">Uzaktan görüntülü görüşme</span>
                                    </div>
                                </label>
                                <label className={`flex-1 cursor-pointer rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${mode === 'FaceToFace' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="FaceToFace"
                                        checked={mode === 'FaceToFace'}
                                        onChange={(e) => setMode(e.target.value)}
                                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold">Yüz Yüze</span>
                                        <span className="text-xs opacity-80">Birebir fiziksel ortamda</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Saatlik Ücret (₺)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>

                            {role === 'Admin' && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Durum</label>
                                    <div className="relative">
                                        <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="Draft">Taslak (Gizli)</option>
                                            <option value="Published">Yayında (Herkes Görebilir)</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="pt-4 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(backLink)}
                                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-70 flex items-center gap-2"
                            >
                                {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                                Değişiklikleri Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default EditListing;
