import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, Plus, Tag, LogIn, Mail } from 'lucide-react';
import GroupModal from '../components/GroupModal';
import MembersModal from '../components/MembersModal';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const res = await api.get('/groups');
            setGroups(res.data);
        } catch (err) {
            console.error('Failed to fetch groups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleJoinGroup = async () => {
        const id = prompt('Enter the Numeric ID of the group you want to join:');
        if (!id) return;
        try {
            await api.post(`/groups/${id}/join`);
            fetchGroups();
            alert('Enrolled in group successfully!');
        } catch (err) {
            alert(err.response?.data?.error || 'Could not join group. Check the ID.');
        }
    };

    const handleInvite = async (groupId) => {
        const email = prompt('Enter friend\'s email to invite:');
        if (!email) return;
        try {
            await api.post(`/groups/${groupId}/invite`, { email });
            alert('Invitation sent!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to send invite.');
        }
    };

    const handleViewMembers = (group) => {
        setSelectedGroup(group);
        setIsMembersModalOpen(true);
    };

    return (
        <div>
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Friend Groups</h1>
                    <p className="text-gray-500">Share your fridge with specific circles.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleJoinGroup}
                        className="bg-white text-gray-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-gray-100 hover:bg-gray-50 transition-all"
                    >
                        <LogIn size={20} />
                        Join ID
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                    >
                        <Plus size={20} />
                        New Group
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <div key={group.id} className="glass p-6 hover:scale-[1.02] transition-transform relative group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                                    <Users size={24} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-xl text-gray-900 truncate">{group.name}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                                        ID: {group.id}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm mb-6 min-h-[40px] leading-relaxed">
                                {group.description || 'No description provided.'}
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleViewMembers(group)}
                                    className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
                                >
                                    View Members
                                </button>
                                <button 
                                    onClick={() => handleInvite(group.id)}
                                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                    title="Invite Friend"
                                >
                                    <Mail size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass p-12 text-center max-w-md mx-auto mt-10">
                    <div className="bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Users className="text-emerald-300" size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No groups yet</h2>
                    <p className="text-gray-500 mb-8">Create a group or join an existing one using an ID to start sharing with friends.</p>
                </div>
            )}

            <GroupModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchGroups} 
            />

            <MembersModal 
                isOpen={isMembersModalOpen} 
                onClose={() => setIsMembersModalOpen(false)} 
                group={selectedGroup} 
            />
        </div>
    );
};

export default Groups;
