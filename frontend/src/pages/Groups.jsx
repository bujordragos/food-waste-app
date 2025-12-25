import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, Plus, Tag } from 'lucide-react';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await api.get('/groups');
                setGroups(res.data);
            } catch (err) {
                console.error('Failed to fetch groups');
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    return (
        <div>
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Friend Groups</h1>
                    <p className="text-gray-500">Share your fridge with specific circles.</p>
                </div>
                <button className="btn-primary flex items-center justify-center gap-2">
                    <Plus size={20} />
                    New Group
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <div key={group.id} className="glass p-6 hover:scale-[1.02] transition-transform">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900">{group.name}</h3>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase">
                                        <Tag size={12} />
                                        {group.category || 'General'}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm mb-6">{group.description || 'No description provided.'}</p>
                            <button className="w-full py-2 bg-gray-50 text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-colors">
                                View Members
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass p-12 text-center max-w-md mx-auto mt-10">
                    <div className="bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Users className="text-emerald-300" size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No groups yet</h2>
                    <p className="text-gray-500 mb-8">Create a group to share food with your friends and family.</p>
                </div>
            )}
        </div>
    );
};

export default Groups;
