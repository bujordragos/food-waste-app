import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 lg:flex">
            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-30 bg-white/60 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-black text-emerald-600 tracking-tighter">ANTIWASTE</h1>
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 border border-gray-200 rounded-lg text-gray-500"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
