import React from 'react';
import { Star, Globe, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('//')) return url;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5024';
    return `${baseUrl}${url}`;
};

const ListingCard = ({ listing }) => {
    const images = listing.images && listing.images.length > 0 ? listing.images : [];
    const bgImage = getImageUrl(images[0]);

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group relative">
            <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                    src={bgImage}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-indigo-600 shadow-sm uppercase tracking-wider">
                    {listing.categoryName || 'Genel'}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {listing.tutorName}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium line-clamp-1" title={listing.title}>
                            {listing.title}
                        </p>
                    </div>

                </div>
                <div className="flex flex-wrap gap-3 mb-6">
                    {listing.mode && (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${listing.mode === 'Online' ? 'bg-indigo-50 text-indigo-700' : 'bg-orange-50 text-orange-700'}`}>
                            {listing.mode === 'Online' ? <Globe className="w-3 h-3" /> : <i className="lucide-users w-3 h-3"></i>}
                            {listing.mode === 'Online' ? 'Online' : 'Yüz Yüze'}
                        </span>
                    )}
                </div>
                <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Saatlik</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-indigo-600">{listing.price} ₺</span>
                        </div>
                    </div>
                    <Link
                        to={`/listings/${listing.id}`}
                        className="group/btn relative inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-indigo-600 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-indigo-200"
                    >
                        İncele
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
