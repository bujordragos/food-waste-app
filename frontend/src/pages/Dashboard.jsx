import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Search, Filter } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleToggleAvailable = async (id) => {
        try {
            await api.patch(`/products/${id}/available`);
            fetchProducts();
        } catch (err) {
            alert('Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Group products by category
    const categories = ['All', ...new Set(products.map(p => p.category))];
    const filteredProducts = filterCategory === 'All' 
        ? products 
        : products.filter(p => p.category === filterCategory);

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-md border-b border-gray-100 mb-8">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-emerald-600 tracking-tight">ANTIWASTE</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-bold text-gray-400 uppercase">My Shelf</p>
                            <p className="font-semibold text-gray-900">{user.username}</p>
                        </div>
                        <button onClick={handleLogout} className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                            <LogOut size={22} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6">
                {/* Actions Row */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                                    filterCategory === cat 
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onToggleAvailable={handleToggleAvailable}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="glass p-12 text-center max-w-md mx-auto mt-10">
                        <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Plus className="text-gray-300" size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your fridge is empty!</h2>
                        <p className="text-gray-500 mb-8">Start adding items manually or use the scanner to save time.</p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary py-3 px-8"
                        >
                            Add Your First Item
                        </button>
                    </div>
                )}
            </main>

            <ProductModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchProducts} 
            />
        </div>
    );
};

export default Dashboard;
