import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Search, Compass } from 'lucide-react';

const Explore = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchExploreProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products/explore');
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch explore products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExploreProducts();
    }, []);

    const handleClaim = async (id) => {
        if (!window.confirm('Do you want to claim this product?')) return;
        try {
            await api.post(`/products/${id}/claim`);
            fetchExploreProducts(); // refresh list
            alert('Product claimed! Check "My Fridge"');
        } catch (err) {
            alert(err.response?.data?.error || 'Claim failed');
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Marketplace</h1>
                <p className="text-gray-500">Discover what's available in your community.</p>
            </header>

            {/* Search Bar */}
            <div className="relative mb-8 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by name or brand..."
                    className="input-field py-4"
                    style={{ paddingLeft: '3.5rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

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
                            mode="explore"
                            onClaim={handleClaim}
                        />
                    ))}
                </div>
            ) : (
                <div className="glass p-12 text-center max-w-md mx-auto mt-10">
                    <div className="bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Compass className="text-emerald-300" size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Market is quiet...</h2>
                    <p className="text-gray-500">No items available for sharing right now. Check back later!</p>
                </div>
            )}
        </div>
    );
};

export default Explore;
