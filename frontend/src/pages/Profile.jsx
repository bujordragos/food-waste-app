import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { User, Tag, FileText, Save, CheckCircle } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        bio: '',
        phone: '',
        dietaryTags: 'None'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const tags = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Lactose-Free', 'Nut-Free', 'Halal', 'Kosher'];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                setProfile(res.data);
            } catch (err) {
                console.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await api.post('/users/profile', {
                bio: profile.bio,
                phone: profile.phone,
                dietaryTags: profile.dietaryTags
            });
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-500">Manage your dietary preferences and bio.</p>
            </header>

            <form onSubmit={handleUpdate} className="space-y-6">
                <div className="glass p-8 space-y-6">
                    {/* read-only info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Username</label>
                            <div className="flex items-center gap-2 text-gray-900 font-semibold bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <User size={18} className="text-emerald-500" />
                                {profile.username}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Email Address</label>
                            <div className="text-gray-500 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 truncate">
                                {profile.email}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Phone (for WhatsApp)</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="+40 7xx xxx xxx"
                                value={profile.phone || ''}
                                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* about me */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
                            <FileText size={14} /> Bio
                        </label>
                        <textarea 
                            className="input-field min-h-[120px] resize-none"
                            placeholder="Tell friends a bit about yourself..."
                            value={profile.bio || ''}
                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        ></textarea>
                    </div>

                    {/* food preferences */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4 flex items-center gap-2">
                            <Tag size={14} /> Dietary Preferences
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => setProfile({...profile, dietaryTags: tag})}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                                        profile.dietaryTags === tag 
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                                        : 'bg-white border-gray-100 text-gray-500 hover:border-emerald-200 hover:text-emerald-600'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    {message && (
                        <p className={`text-sm font-bold flex items-center gap-2 ${message.includes('successfully') ? 'text-emerald-600' : 'text-red-500'}`}>
                            <CheckCircle size={16} /> {message}
                        </p>
                    )}
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 ml-auto shadow-xl shadow-emerald-200 px-8"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
