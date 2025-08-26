import { useState } from 'react';
import { Heart, MessageSquare, Compass, Settings, LogOut, Sparkle, Star, Check } from 'lucide-react';
import { Modal, Button } from 'antd';

const navItems = [
    { name: 'Discovery', icon: <Compass />, page: 'discovery' },
    { name: 'Liked', icon: <Heart />, page: 'liked' },
    { name: 'Chats', icon: <MessageSquare />, page: 'chats' },
    { name: 'Settings', icon: <Settings />, page: 'settings' },
];

const PremiumModal = ({ isOpen, closeModal }) => (
    <Modal open={isOpen} onCancel={closeModal} centered footer={null} width={450}>
        <div className="p-6 text-center">
            <div className="flex flex-col items-center text-gray-800">
                <Star className="w-16 h-16 text-yellow-400 mb-4" fill="currentColor" />
                <h1 className="text-4xl font-bold font-display mb-4">Matina Gold</h1>
                <ul className="text-left mb-6 space-y-2">
                    <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" /> Access to unlimited matches
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" /> See who viewed your profile
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" /> Send unlimited messages
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" /> Boost your profile visibility
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" /> Exclusive premium badge
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" /> Priority customer support
                    </li>
                </ul>
            </div>
            <Button
                type="primary"
                size="large"
                block
                style={{ backgroundColor: '#FBBF24', color: '#1F2937' }}
            >
                Upgrade Now - Rs. 999/month
            </Button>
        </div>
    </Modal>
);


const Sidebar = ({ navigateTo, currentPage, activeUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getAge = (birthday) => {
        if (!birthday) return '';
        const age = new Date().getFullYear() - new Date(birthday).getFullYear();
        return age > 0 ? age : '';
    };

    return (
        <>
            <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-[#7b2d26] via-[#b23a48] to-[#e07a5f] text-white p-6 flex flex-col justify-between rounded-r-3xl h-full shadow-xl">
                <div>
                    <div className="flex items-center space-x-3 mb-8">
                        <img src="/images/hearts.png" alt="Matina Logo" className="w-8 h-8" />
                        <span className="text-2xl font-bold text-white">Matina</span>
                    </div>
                    {activeUser ? (
                        <div className="flex items-center space-x-3 mb-5 p-2 rounded-lg bg-white/10">
                            <img
                                src={activeUser.images?.[0]?.imageUrl}
                                alt={`${activeUser.firstName}`}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => { e.target.src = "https://placehold.co/48x48/71717a/FFFFFF?text=User"; }}
                            />
                            <p className="font-semibold text-lg">
                                {activeUser.firstName},
                                <span className="font-normal"> {getAge(activeUser.userProfile?.birthday)}</span>
                            </p>
                        </div>
                    ) : (
                        <div className="animate-pulse flex items-center space-x-3 mb-5 p-2 rounded-lg h-[68px] bg-white/10">
                            <div className="w-12 h-12 rounded-full bg-white/20"></div>
                            <div className="h-5 w-3/4 bg-white/20 rounded"></div>
                        </div>
                    )}
                    <nav>
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.page}>
                                    <button
                                        onClick={() => navigateTo(item.page)}
                                        className={`flex items-center w-full space-x-3 p-3 rounded-lg transition-all
                                            ${currentPage === item.page
                                                ? 'bg-white text-pink-600 shadow-md'
                                                : 'text-white/80 hover:bg-white/20 hover:text-white'
                                            }`}
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div>
                    <div className="p-4 mb-4 bg-white/10 rounded-xl text-center">
                        <Sparkle className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                        <p className="text-sm font-semibold text-gray-200 mb-2">
                            🌟 Spotlight Feature: Get your profile noticed by premium members!
                        </p>
                        <p className="text-sm text-gray-300 mb-4">
                            Exclusive access to new features before everyone else.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-2 text-sm font-bold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500"
                        >
                            Learn More
                        </button>
                    </div>

                    <button
                        onClick={() => navigateTo('logout')}
                        className="flex items-center w-full space-x-3 p-3 rounded-lg text-white-200 "
                    >
                        <LogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            <PremiumModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
        </>
    );
};

export default Sidebar;
