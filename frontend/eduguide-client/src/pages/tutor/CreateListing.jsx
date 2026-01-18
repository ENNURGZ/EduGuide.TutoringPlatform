import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Upload, DollarSign, List, FileText, X } from 'lucide-react';
import { createListing } from '../../api/listing';
import { getCategories } from '../../api/category';
import Layout from '../../components/Layout';

const CreateListing = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [mode, setMode] = useState('Online');
    const [categoryId, setCategoryId] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    useEffect(() => {//backend
        const fetchCats = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Kategoriler alınamadı', error);
            }
        };
        fetchCats();
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Limit check removed as per new requirement 'En az 3' (Min 3)
        setSelectedFiles(files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(newPreviews);
    };

    const removeImage = (index) => { // Clean files
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);

        const newPreviews = [...previewUrls];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviewUrls(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Min 3 Images
        if (selectedFiles.length < 3) {
            alert("İlan oluşturmak için en az 3 adet fotoğraf yüklemelisiniz.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('Title', title);
            formData.append('Description', description);
            formData.append('Description', description);
            formData.append('Price', price);
            formData.append('Mode', mode);
            formData.append('CategoryId', categoryId);

            selectedFiles.forEach(file => {
                formData.append('Images', file);
            });

            await createListing(formData);
            navigate('/dashboard');
        } catch (error) {
            console.error('İlan oluşturma hatası', error);
            alert('İlan oluşturulurken bir hata oluştu: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    // file input
    const fileInputRef = React.useRef(null);

    const handleContainerClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files);
        // Removed max file alert from selection
        if (files && files.length > 0) {
            setSelectedFiles(files);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(newPreviews);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Panele Dön
                </Link>

                <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-8 sm:p-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Yeni İlan Oluştur</h1>
                    <p className="text-gray-500 mb-8">Bilgileri eksiksiz doldurarak ders ilanınızı yayınlayın.</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 float-left">İlan Başlığı</label>
                                <span className="text-xs text-gray-400 float-right mt-1">Örn: LGS Matematik Özel Ders</span>
                                <div className="clear-both relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                        placeholder="Kısa ve açıklayıcı bir başlık girin"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Açıklama</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
                                    placeholder="Ders içeriği, deneyimleriniz ve metodolojinizden bahsedin..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Ders İşleme Şekli</label>
                            <div className="flex gap-4">
                                <div
                                    onClick={() => setMode('Online')}
                                    className={`flex-1 cursor-pointer rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${mode === 'Online' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === 'Online' ? 'border-indigo-600' : 'border-gray-300'}`}>
                                        {mode === 'Online' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold">Online</span>
                                        <span className="text-xs opacity-80">Uzaktan görüntülü görüşme</span>
                                    </div>
                                </div>
                                <div
                                    onClick={() => setMode('FaceToFace')}
                                    className={`flex-1 cursor-pointer rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${mode === 'FaceToFace' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === 'FaceToFace' ? 'border-indigo-600' : 'border-gray-300'}`}>
                                        {mode === 'FaceToFace' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold">Yüz Yüze</span>
                                        <span className="text-xs opacity-80">Birebir fiziksel ortamda</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Kategori</label>
                                <div className="relative">
                                    <List className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                    >
                                        <option value="">Seçiniz</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Saatlik Ücret (₺)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        placeholder="0.00"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">İlan Görselleri</label>

                            <div
                                onClick={handleContainerClick}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-500 transition-colors cursor-pointer bg-gray-50 group relative"
                            >
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none" onClick={(e) => e.stopPropagation()}>
                                            <span>Dosya Yükle</span>
                                            <input
                                                ref={fileInputRef}
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">veya sürükleyip bırakın</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF (Max 3 dosya)</p>
                                </div>
                            </div>

                            {previewUrls.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    {previewUrls.map((url, idx) => (
                                        <div key={idx} className="relative group">
                                            <img src={url} alt={`Preview ${idx}`} className="h-24 w-full object-cover rounded-lg border border-gray-200" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-70 flex items-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                İlanı Yayınla
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CreateListing;
