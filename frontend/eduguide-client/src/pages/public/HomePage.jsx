import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import FilterSidebar from '../../components/FilterSidebar';
import ListingCard from '../../components/ListingCard';
import { getListings } from '../../api/listing';
import { Search, ChevronDown, CheckCircle, Shield, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ categoryId: null });

    const fetchListings = async () => {
        setLoading(true);
        try {
            const params = { PageSize: 6 }; //Limit 6
            if (filter.categoryId) params.CategoryId = filter.categoryId;

            const data = await getListings(params);
            setListings(data);
        } catch (error) {
            console.error("Failed to fetch listings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [filter]);

    const handleFilterChange = (newFilter) => {
        setFilter((prev) => ({ ...prev, ...newFilter }));
    };

    return (
        <Layout>
            <div className="flex flex-col gap-16 pb-12">
                <div className="relative bg-slate-900 rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-20 text-center sm:text-left shadow-2xl shadow-indigo-900/40">
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium text-sm mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Yeni Nesil Özel Ders Platformu
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                            Geleceğinizi <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Uzmanlarla Şekillendirin</span>
                        </h1>
                        <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                            Matematikten yabancı dile, kodlamadan sanata, binlerce eğitmen arasından size en uygun olanı bulun.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/listings" className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
                                Dersleri İncele
                            </Link>
                            <Link to="/register" className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm text-white font-bold text-lg transition-all">
                                Eğitmen Ol
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Güvenilir Eğitmenler</h3>
                        <p className="text-gray-500">Tüm eğitmenlerimiz kimlik ve yetkinlik doğrulamasından geçmektedir.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Başarı Odaklı</h3>
                        <p className="text-gray-500">Kişiselleştirilmiş öğrenme planları ile hedeflerinize daha hızlı ulaşın.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">Geniş Topluluk</h3>
                        <p className="text-gray-500">Binlerce öğrenci ve velinin tercih ettiği, büyüyen bir eğitim ailesi.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <FilterSidebar onFilterChange={handleFilterChange} selectedCategory={filter.categoryId} />
                    <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Öne Çıkan Ders İlanları</h2>
                            <Link to="/listings" className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 text-sm">
                                Tümünü Gör <ChevronDown className="w-4 h-4 -rotate-90" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
                                ))}
                            </div>
                        ) : listings.length > 0 ? (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {listings.map((listing) => (
                                    <div key={listing.id} className="h-full">
                                        <ListingCard listing={listing} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                                <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">İlan Bulunamadı</h3>
                                <p className="text-gray-500 font-medium mt-1">Bu kategoride henüz aktif bir ders ilanı yok.</p>
                                <button onClick={() => setFilter({ categoryId: null })} className="text-indigo-600 font-bold mt-4 hover:underline">
                                    Filtreleri Temizle
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
