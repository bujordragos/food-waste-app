import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, Users, LogOut, Package, X, Settings, Moon, Sun } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { name: 'My Fridge', path: '/dashboard', icon: <Package size={20} /> },
        { name: 'Explore Market', path: '/explore', icon: <Compass size={20} /> },
        { name: 'Friend Groups', path: '/groups', icon: <Users size={20} /> },
    ];

    return (
        <>
            {/* mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* sidebar content */}
            <aside className={`fixed inset-y-0 left-0 w-64 sidebar glass rounded-none border-r border-white/20 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* header */}
                    <div className="p-6 flex justify-between items-center">
                        <h1 className="text-xl font-black text-emerald-600 tracking-tighter">ANTIWASTE</h1>
                        <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>

                    {/* navigation */}
                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                    isActive 
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                                    : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'
                                }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* footer area */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold flex-shrink-0">
                                {user.username?.[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
                                <p className="text-xs text-gray-400 truncate">Member</p>
                            </div>
                            <NavLink 
                                to="/profile" 
                                className={({ isActive }) => `p-2 rounded-lg transition-all ${isActive ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                title="Settings"
                            >
                                <Settings size={18} />
                            </NavLink>
                        </div>

                        {/* appearance toggle */}
                        <div className="px-2 mb-2">
                            <button 
                                onClick={toggleTheme}
                                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all border border-gray-100/50"
                            >
                                <div className="flex items-center gap-2">
                                    {isDark ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-indigo-500" />}
                                    <span>{isDark ? 'Light' : 'Dark'} Appearance</span>
                                </div>
                                <div className={`w-9 h-5 rounded-full p-1 transition-colors flex items-center ${isDark ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'}`}>
                                    <div className="w-3 h-3 rounded-full bg-white shadow-sm transition-all"></div>
                                </div>
                            </button>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
