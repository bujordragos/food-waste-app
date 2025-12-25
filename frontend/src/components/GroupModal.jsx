import React, { useState } from 'react';
import { X, Users, Save, Loader2, Info } from 'lucide-react';
import api from '../utils/api';

const GroupModal = ({ isOpen, onClose, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/groups', formData);
            onRefresh();
            onClose();
            setFormData({ name: '', description: '' });
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="glass w-full max-w-md overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/20 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="text-emerald-500" size={24} />
                        New Social Group
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Group Name</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="e.g. University Dorm, Neighbors..."
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2">
                            <Info size={14} /> Description
                        </label>
                        <textarea 
                            className="input-field min-h-[100px] resize-none"
                            placeholder="What is this group for?"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3 shadow-xl shadow-emerald-200"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupModal;
