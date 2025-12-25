import React from 'react';
import { Calendar, Tag, Share2, Trash2, User } from 'lucide-react';

const ProductCard = ({ product, onToggleAvailable, onDelete, onClaim, mode = 'mine' }) => {
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
        <div className={`glass p-5 flex flex-col gap-4 transition-all hover:scale-[1.01] border-l-4 h-full relative group ${
            isExpired() ? 'border-l-red-500' : isExpiringSoon() ? 'border-l-amber-500' : 'border-l-emerald-500'
        }`}>
            {/* Owner badge for explore mode */}
            {mode === 'explore' && product.User && (
                <div className="absolute -top-3 right-4 px-2 py-1 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center gap-1.5 z-10">
                    <User size={10} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-gray-600">{product.User.username}</span>
                </div>
            )}

            <div className="flex justify-between items-start gap-2">
                <div className="flex gap-3 min-w-0">
                    {product.image && (
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-white shadow-sm flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-800 leading-tight truncate px-1" title={product.name}>{product.name}</h3>
                        <p className="text-xs text-gray-400 font-medium px-1 mt-0.5">{product.brand || 'No brand'}</p>
                    </div>
                </div>

                {/* Only show edit/delete if it's "mine" */}
                {mode === 'mine' && (
                    <div className="flex gap-1 flex-shrink-0">
                        <button 
                            onClick={() => onToggleAvailable(product.id)} 
                            className={`p-2 rounded-lg transition-colors ${product.isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400 hover:bg-emerald-50'}`}
                            title={product.isAvailable ? "Shared" : "Make Available"}
                        >
                            <Share2 size={16} />
                        </button>
                        <button 
                            onClick={() => onDelete(product.id)} 
                            className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
                <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500 uppercase tracking-wider">
                    <Tag size={12} />
                    {product.category || 'General'}
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                    isExpired() ? 'bg-red-50 text-red-600' : isExpiringSoon() ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                    <Calendar size={12} />
                    {product.expirationDate ? new Date(product.expirationDate).toLocaleDateString() : 'No date'}
                </div>
            </div>

            {/* In My Fridge, show status badge. In Explore, show Claim button */}
            {mode === 'mine' ? (
                product.isAvailable && (
                    <div className="py-1 px-3 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full self-start">
                        Visible in Market
                    </div>
                )
            ) : (
                <button 
                    onClick={() => onClaim(product.id)}
                    className="btn-primary w-full py-2.5 mt-2 text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                >
                    Claim This Item
                </button>
            )}
        </div>
    );
};

export default ProductCard;
