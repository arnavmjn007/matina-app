import { useState } from 'react';
import { Heart, MessageSquare, Compass, Settings, LogOut, Sparkle, Star, Zap, CheckCircle } from 'lucide-react';
import { Modal, Button } from 'antd';
import 'antd/dist/reset.css';

const navItems = [
    { name: 'Discovery', icon: <Compass />, page: 'discovery' },
    { name: 'Liked', icon: <Heart />, page: 'liked' },
    { name: 'Chats', icon: <MessageSquare />, page: 'chats' },
    { name: 'Settings', icon: <Settings />, page: 'settings' },
];

const PremiumModal = ({ isOpen, closeModal }) => {
    const premiumFeatures = [
        { icon: <Heart className="text-pink-400" />, text: "See everyone who likes you" },
        { icon: <Zap className="text-yellow-400" />, text: "Spotlight your profile once a month" },
        { icon: <CheckCircle className="text-green-400" />, text: "Unlimited likes and rewinds" },
        { icon: <Star className="text-blue-400" />, text: "Stand out with Super Likes" },
    ];

    return (
        <Modal
            open={isOpen}
            onCancel={closeModal}
            centered
            footer={null}
            width={450}
        >
            <div className="p-6 text-center">
                <div className="flex flex-col items-center text-gray-800">
                    <Star className="w-16 h-16 text-yellow-400 mb-4" fill="currentColor" />
                    <h1 className="text-4xl font-bold font-display">Matina Gold</h1>
                    <p className="mt-2 text-gray-500">Unlock your full dating potential.</p>
                </div>
                <div className="space-y-4 text-left my-8">
                    {premiumFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="flex-shrink-0">{feature.icon}</div>
                            <span className="text-lg text-gray-700">{feature.text}</span>
                        </div>
                    ))}
                </div>
                <Button type="primary" size="large" block style={{ backgroundColor: '#FBBF24', borderColor: '#FBBF24', color: '#1F2937', fontWeight: 'bold' }}>
                    Upgrade Now - $9.99/mo
                </Button>
            </div>
        </Modal>
    );
};

const Sidebar = ({ navigateTo, currentPage, activeUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <aside className="w-64 flex-shrink-0 bg-gray-900 text-white p-6 flex flex-col justify-between rounded-r-3xl shadow-2xl h-full">
                {/* Top Section */}
                <div>
                    <div className="flex items-center space-x-3 mb-8">
                        <img src="/images/hearts.png" alt="Matina Logo" className="w-8 h-8" />
                        <span className="text-2xl font-bold text-pink-400">Matina</span>
                    </div>

                    {/* Dynamic User Info Block */}
                    {activeUser ? (
                        <div className="flex items-center space-x-3 mb-5 p-2 rounded-lg">
                            <img
                                src={activeUser.profileImages[0]}
                                alt={activeUser.name}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/71717a/FFFFFF?text=User"; }}
                            />
                            <p className="font-semibold text-lg">{activeUser.name}, <span className="font-normal text-base">{activeUser.age}</span></p>
                        </div>
                    ) : (
                        // Loading placeholder
                        <div className="flex items-center space-x-3 mb-5 p-2 rounded-lg h-[68px]">
                            <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
                            <div className="flex-1">
                                <div className="h-5 w-3/4 bg-gray-700 rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                            </div>
                        </div>
                    )}

                    <nav>
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.page}>
                                    <button
                                        onClick={() => navigateTo(item.page)}
                                        className={`flex items-center w-full space-x-3 p-3 rounded-lg font-medium transition-colors ${currentPage === item.page
                                            ? 'bg-gray-700 text-pink-400'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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

                {/* Bottom Section */}
                <div className="mt-8">
                    <div className="p-4 mb-4 bg-gray-800 rounded-xl text-center">
                        <Sparkle className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                        <p className="text-sm font-semibold">Match Queue</p>
                        <p className="text-xs text-gray-400 mb-3">Spotlight is the easiest way to up your odds of a match!</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-2 text-sm font-bold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors"
                        >
                            Learn More
                        </button>
                    </div>
                    <button
                        onClick={() => navigateTo('logout')}
                        className="flex items-center w-full space-x-3 p-3 rounded-lg font-medium text-red-500 hover:bg-gray-800 transition-colors"
                    >
                        <LogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Render the Ant Design modal */}
            <PremiumModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
        </>
    );
};

export default Sidebar;
