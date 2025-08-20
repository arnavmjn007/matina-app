import { useState } from 'react';
import { Heart, MessageSquare, Compass, Settings, LogOut, Sparkle, Star} from 'lucide-react';
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
                <h1 className="text-4xl font-bold font-display">Matina Gold</h1>
            </div>
            {/* ... other modal content ... */}
            <Button type="primary" size="large" block style={{ backgroundColor: '#FBBF24', color: '#1F2937' }}>
                Upgrade Now - $9.99/mo
            </Button>
        </div>
    </Modal>
);

const Sidebar = ({ navigateTo, currentPage, activeUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getAge = (birthday) => {
        if (!birthday) return '';
        const age = new Date().getFullYear() - new Date(birthday).getFullYear();
        // This is a simplified age calculation
        return age > 0 ? age : '';
    };

    return (
        <>
            <aside className="w-64 flex-shrink-0 bg-gray-900 text-white p-6 flex flex-col justify-between rounded-r-3xl h-full">
                <div>
                    <div className="flex items-center space-x-3 mb-8">
                        <img src="/images/hearts.png" alt="Matina Logo" className="w-8 h-8" />
                        <span className="text-2xl font-bold text-pink-400">Matina</span>
                    </div>
                    {activeUser ? (
                        <div className="flex items-center space-x-3 mb-5 p-2 rounded-lg">
                            <img
                                src={activeUser.userProfile?.profileImageUrl}
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
                        <div className="animate-pulse flex items-center space-x-3 mb-5 p-2 rounded-lg h-[68px]">
                            <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                            <div className="h-5 w-3/4 bg-gray-700 rounded"></div>
                        </div>
                    )}
                    <nav>
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.page}>
                                    <button onClick={() => navigateTo(item.page)} className={`flex items-center w-full space-x-3 p-3 rounded-lg ${currentPage === item.page ? 'bg-gray-700 text-pink-400' : 'text-gray-300 hover:bg-gray-800'}`}>
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div>
                    <div className="p-4 mb-4 bg-gray-800 rounded-xl text-center">
                        <Sparkle className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                        <button onClick={() => setIsModalOpen(true)} className="w-full py-2 text-sm font-bold text-gray-900 bg-yellow-400 rounded-lg">
                            Learn More
                        </button>
                    </div>
                    <button onClick={() => navigateTo('logout')} className="flex items-center w-full space-x-3 p-3 rounded-lg text-red-500 hover:bg-gray-800">
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