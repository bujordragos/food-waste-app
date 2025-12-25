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
                        {product.description?.match(/Claimed( from)?: /) && (
                            <div className="mt-2 px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-bold border border-indigo-100 dark:border-indigo-500/20">
                                <div className="flex flex-col gap-0.5">
                                    <span className="opacity-70 text-[8px] uppercase tracking-wider">Original Owner Contact</span>
                                    <span className="truncate">
                                        {product.description.split('.')[0].replace(/Claimed( from)?: /, '').split(' | ')[0]}
                                    </span>
                                    {product.description.includes(' | Phone: ') && (
                                        <span className="text-emerald-500 dark:text-emerald-400">
                                            {product.description.split(' | Phone: ')[1].split('.')[0]}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
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

            {/* In My Fridge, show status badge + social share. In Explore, show Claim button */}
            {mode === 'mine' ? (
                product.isAvailable ? (
                    <div className="space-y-3">
                        <div className="py-1 px-3 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full self-start inline-block">
                            Visible in Market
                        </div>
                        
                        {/* Social Sharing Mini-Bar */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Share:</span>
                            <div className="flex gap-1.5">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors">
                                    <svg size={14} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                                </a>
                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this ' + product.name + ' available on AntiWaste! ' + window.location.origin)}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 transition-colors">
                                    <svg size={14} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.407 3.481 2.241 2.242 3.48 5.226 3.481 8.408-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.3 1.656zm6.29-4.115l.356.212c1.453.864 3.124 1.319 4.839 1.32h.01c5.728 0 10.39-4.661 10.393-10.39 0-2.779-1.082-5.391-3.048-7.357-1.966-1.966-4.577-3.048-7.356-3.048-5.729 0-10.391 4.661-10.393 10.39 0 1.832.481 3.622 1.391 5.21l.232.404-.97 3.543 3.635-.954z"/></svg>
                                </a>
                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('I am sharing ' + product.name + ' for free on AntiWaste! @AntiWasteApp')}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:bg-sky-50 text-sky-500 transition-colors">
                                    <svg size={14} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Claimed item in my fridge
                    product.description?.includes(' | Phone: ') && (
                        <a 
                            href={`https://wa.me/${product.description.split(' | Phone: ')[1].split('.')[0].replace(/\s+/g, '')}?text=${encodeURIComponent('Hi, I claimed your ' + product.name + ' on AntiWaste and would like to arrange pickup!')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.407 3.481 2.241 2.242 3.48 5.226 3.481 8.408-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.3 1.656zm6.29-4.115l.356.212c1.453.864 3.124 1.319 4.839 1.32h.01c5.728 0 10.39-4.661 10.393-10.39 0-2.779-1.082-5.391-3.048-7.357-1.966-1.966-4.577-3.048-7.356-3.048-5.729 0-10.391 4.661-10.393 10.39 0 1.832.481 3.622 1.391 5.21l.232.404-.97 3.543 3.635-.954z"/></svg>
                            Contact for Pickup
                        </a>
                    )
                )
            ) : (
                <div className="space-y-2">
                    {product.User?.phone && (
                        <a 
                            href={`https://wa.me/${product.User.phone.replace(/\s+/g, '')}?text=${encodeURIComponent('Hi ' + product.User.username + ', I saw your ' + product.name + ' on AntiWaste and I am interested!')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.407 3.481 2.241 2.242 3.48 5.226 3.481 8.408-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.3 1.656zm6.29-4.115l.356.212c1.453.864 3.124 1.319 4.839 1.32h.01c5.728 0 10.39-4.661 10.393-10.39 0-2.779-1.082-5.391-3.048-7.357-1.966-1.966-4.577-3.048-7.356-3.048-5.729 0-10.391 4.661-10.393 10.39 0 1.832.481 3.622 1.391 5.21l.232.404-.97 3.543 3.635-.954z"/></svg>
                            WhatsApp Chat
                        </a>
                    )}
                    <button 
                        onClick={() => onClaim(product.id)}
                        className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                    >
                        Claim This Item
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
