import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, Filter } from 'lucide-react';
import { getCategories } from '../api/category';

const FilterSidebar = ({ onFilterChange, selectedCategory }) => {
    const [categories, setCategories] = useState([]);
    const [localCategory, setLocalCategory] = useState(selectedCategory);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId) => {
        const newVal = localCategory === categoryId ? null : categoryId;
        setLocalCategory(newVal);
        onFilterChange({ categoryId: newVal });
    };

    return (
        <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-24">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                    <Filter className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-gray-900 text-lg">Filtreleme</h3>
                </div>
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-900 font-bold text-sm uppercase tracking-wide">Kategori</span>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {categories.map((cat) => (
                            <label
                                key={cat.id}
                                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${localCategory === cat.id
                                    ? 'bg-indigo-50 border-indigo-100 text-indigo-700 shadow-sm'
                                    : 'bg-white border-transparent hover:bg-gray-50 text-gray-600'
                                    }`}
                                onClick={() => handleCategoryClick(cat.id)}
                            >
                                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${localCategory === cat.id
                                    ? 'bg-indigo-600 border-indigo-600'
                                    : 'border-gray-300 bg-white group-hover:border-indigo-300'
                                    }`}>
                                    {localCategory === cat.id && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className="text-sm font-medium">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <button
                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl hover:bg-indigo-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 font-bold flex items-center justify-center gap-2 active:scale-95"
                    >
                        Sonuçları Göster
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
