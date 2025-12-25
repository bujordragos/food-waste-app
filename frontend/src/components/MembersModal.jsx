import React, { useState, useEffect } from 'react';
import { X, Users, User, Tag, Loader2 } from 'lucide-react';
import api from '../utils/api';

const MembersModal = ({ isOpen, onClose, group }) => {
    const [members, setMembers] = useState([]);
    const [adminId, setAdminId] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // user auth data
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/groups/${group.id}/members`);
            setMembers(res.data.members);
            setAdminId(res.data.adminId);
        } catch (err) {
            console.error('Failed to fetch members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && group) {
            fetchMembers();
        }
    }, [isOpen, group]);

    const handleKickMember = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this member from the group?')) return;
        try {
            await api.delete(`/groups/${group.id}/members/${userId}`);
            fetchMembers(); // reload
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to remove member');
        }
    };

    if (!isOpen) return null;

    const isAdmin = currentUser.id === adminId;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
            <div className="glass w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-white/20 flex justify-between items-center bg-white/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{group?.name}</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Community Members</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2 className="animate-spin text-emerald-500" size={32} />
                            <p className="text-sm text-gray-400 font-medium">Loading circle...</p>
                        </div>
                    ) : members.length > 0 ? (
                        <div className="space-y-3">
                            {members.map(member => (
                                <div key={member.id} className="flex items-center gap-4 p-3 rounded-2xl border border-gray-50 bg-white/40 hover:bg-white transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shadow-sm">
                                        {member.username?.[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-gray-900 truncate">{member.username}</p>
                                            {member.id === adminId && (
                                                <span className="text-[9px] px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded-md font-black uppercase tracking-tighter">Admin</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Tag size={10} className="text-gray-300" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                {member.dietaryTags || 'No Restrictions'}
                                            </span>
                                        </div>
                                    </div>
                                    {/* admin tools */}
                                    {isAdmin && member.id !== currentUser.id && (
                                        <button 
                                            onClick={() => handleKickMember(member.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Remove Member"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400 italic">No members found.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100/50 bg-gray-50/30">
                    <button 
                        onClick={onClose}
                        className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Close View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MembersModal;
