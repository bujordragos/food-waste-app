import React from 'react';
import { Calendar, Tag, Share2, Trash2 } from 'lucide-react';

const ProductCard = ({ product, onToggleAvailable, onDelete }) => {
    const isExpiringSoon = () => {
        if (!product.expirationDate) return false;
        const days = Math.ceil((new Date(product.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
        return days <= 3 && days >= 0;
    };

    const isExpired = () => {
        if (!product.expirationDate) return false;
        return new Date(product.expirationDate) < new Date();
    };

    return (
        <div className={`glass p-5 flex flex-col gap-3 transition-all hover:scale-[1.02] border-l-4 ${
            isExpired() ? 'border-l-red-500' : isExpiringSoon() ? 'border-l-amber-500' : 'border-l-emerald-500'
        }`}>
            <div className="flex justify-between items-start">
                <div className="flex gap-3">
                    {product.image && (
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-white shadow-sm" />
                    )}
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.brand || 'No brand'}</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => onToggleAvailable(product.id)} className={`p-2 rounded-full transition-colors ${product.isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Share2 size={16} />
                    </button>
                    <button onClick={() => onDelete(product.id)} className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
                <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-gray-50 text-gray-600">
                    <Tag size={12} />
                    {product.category || 'General'}
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md ${
                    isExpired() ? 'bg-red-50 text-red-600' : isExpiringSoon() ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                    <Calendar size={12} />
                    {product.expirationDate ? new Date(product.expirationDate).toLocaleDateString() : 'No date'}
                </div>
            </div>

            {product.isAvailable && (
                <div className="mt-2 py-1 px-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full self-start">
                    Available to Claim
                </div>
            )}
        </div>
    );
};

export default ProductCard;
