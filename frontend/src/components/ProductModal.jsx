import React, { useState } from 'react';
import { X, Scan, Loader2, Save } from 'lucide-react';
import api from '../utils/api';

const ProductModal = ({ isOpen, onClose, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        category: 'Other',
        expirationDate: '',
        brand: '',
        image: ''
    });

    const categories = ['Dairy', 'Meat', 'Vegetables', 'Fruits', 'Bakery', 'Drinks', 'Other'];

    const handleScan = async () => {
        if (!barcode) return;
        setLoading(true);
        try {
            const res = await api.get(`/products/scan/${barcode}`);
            setFormData({
                ...formData,
                name: res.data.name || '',
                brand: res.data.brand || '',
                image: res.data.image || ''
            });
        } catch (err) {
            alert('Could not find product data for this barcode');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', formData);
            onRefresh();
            onClose();
            setFormData({ name: '', category: 'Other', expirationDate: '', brand: '', image: '' });
            setBarcode('');
        } catch (err) {
            alert('Failed to add product');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="glass w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/20 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
                    {/* Scanner Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Quick Scan (Barcode)</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                className="input-field flex-1" 
                                placeholder="Enter barcode number..."
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                            />
                            <button 
                                onClick={handleScan}
                                disabled={loading}
                                className="bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Scan size={20} />}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                                <select 
                                    className="input-field"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Expiry Date</label>
                                <input 
                                    type="date" 
                                    className="input-field" 
                                    value={formData.expirationDate}
                                    onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                                    required 
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4">
                            <Save size={20} />
                            Add to Fridge
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
