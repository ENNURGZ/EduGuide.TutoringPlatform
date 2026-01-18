import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2, ArrowRight } from 'lucide-react';
import { getListings } from '../../api/listing';
import ListingCard from '../../components/ListingCard';
import FilterSidebar from '../../components/FilterSidebar';
import Layout from '../../components/Layout';

const Listings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ PageSize: 50 });
    const [sortBy, setSortBy] = useState('newest');

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {//search
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const params = { ...filters, SortBy: sortBy, Search: debouncedSearch };
                const data = await getListings(params);
                setListings(data);
            } catch (error) {
                console.error('Listings fetch error', error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [filters, sortBy, debouncedSearch]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tüm Ders İlanları</h1>
                <p className="text-gray-500 mt-2">İhtiyacınıza en uygun özel dersi bulmak için filtreleri kullanın.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <FilterSidebar onFilterChange={handleFilterChange} selectedCategory={filters.CategoryId} />
                <div className="flex-1">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Ders veya eğitmen ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">İlanlar yükleniyor...</p>
                        </div>
                    ) : listings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {listings.map((listing) => (
                                <div key={listing.id} className="h-full">
                                    <ListingCard listing={listing} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">İlan Bulunamadı</h3>
                            <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                                Arama kriterlerinize uygun ilan yok. Farklı filtreler deneyebilirsiniz.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Listings;
