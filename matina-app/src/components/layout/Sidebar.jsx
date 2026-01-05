import { useState } from "react";
import {
  Heart,
  MessageSquare,
  Compass,
  Settings,
  LogOut,
  Sparkle,
  Star,
  Check,
} from "lucide-react";
import { Modal, Button } from "antd";

const navItems = [
  { name: "Discovery", icon: <Compass size={20} />, page: "discovery" },
  { name: "Liked", icon: <Heart size={20} />, page: "liked" },
  { name: "Chats", icon: <MessageSquare size={20} />, page: "chats" },
  { name: "Settings", icon: <Settings size={20} />, page: "settings" },
];

const PremiumModal = ({ isOpen, closeModal }) => (
  <Modal open={isOpen} onCancel={closeModal} centered footer={null} width={450}>
    <div className="p-6 text-center">
      <div className="flex flex-col items-center text-gray-800">
        <Star className="w-16 h-16 text-yellow-400 mb-4" fill="currentColor" />
        <h1 className="text-3xl font-bold font-display mb-3">Matina Gold</h1>
        <ul className="text-left mb-6 space-y-2 text-sm">
          {[
            "Unlimited matches",
            "See who viewed you",
            "Unlimited messages",
            "Boost visibility",
            "Premium badge",
            "Priority support",
          ].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <Button
        type="primary"
        size="large"
        block
        style={{ backgroundColor: "#FBBF24", color: "#1F2937" }}
      >
        Upgrade Now - Rs. 999/month
      </Button>
    </div>
  </Modal>
);

const Sidebar = ({ navigateTo, currentPage, activeUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAge = (birthday) => {
    if (!birthday) return "";
    const age = new Date().getFullYear() - new Date(birthday).getFullYear();
    return age > 0 ? age : "";
  };

  return (
    <>
      <aside
        className="
          w-72 hidden md:flex flex-shrink-0 h-screen
          overflow-hidden
          bg-gradient-to-b from-[#2A0F17] via-[#4A1624] to-[#7A2233]
          text-white
          rounded-r-3xl shadow-2xl
          p-6
          flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
            <img
              src="/images/hearts.png"
              alt="Matina Logo"
              className="w-6 h-6"
            />
          </div>
          <div>
            <div className="text-xl font-extrabold leading-tight">Matina</div>
            <div className="text-xs text-white/70">
              Modern dating, less chaos
            </div>
          </div>
        </div>

        {/* Active user */}
        <div className="mt-5 flex items-center gap-3 bg-white/10 rounded-2xl p-3">
          <img
            src={activeUser?.images?.[0]?.imageUrl}
            alt={activeUser?.firstName || "User"}
            className="w-11 h-11 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "https://placehold.co/44x44/71717a/FFFFFF?text=U";
            }}
          />
          <div className="min-w-0">
            <div className="font-semibold truncate">
              {activeUser ? (
                <>
                  {activeUser.firstName},{" "}
                  <span className="font-normal text-white/80">
                    {getAge(activeUser.userProfile?.birthday)}
                  </span>
                </>
              ) : (
                "Guest"
              )}
            </div>
            <div className="text-xs text-white/70 truncate">
              {activeUser
                ? "Welcome back"
                : "Browse freely. Login for actions."}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-5">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.page}>
                <button
                  onClick={() => navigateTo(item.page)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition
                    ${
                      currentPage === item.page
                        ? "bg-white text-[#7A2233] shadow"
                        : "bg-white/0 text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <span className="opacity-90">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom pinned section (NO scroll) */}
        <div className="mt-auto pt-4 space-y-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                <Sparkle className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <div className="font-semibold text-sm">Spotlight</div>
                <div className="text-xs text-white/75 mt-1 leading-snug">
                  Get noticed by premium members and boost visibility.
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 w-full py-2 text-sm font-bold rounded-xl bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            >
              Learn More
            </button>
          </div>

          <button
            onClick={() => navigateTo("logout")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 hover:bg-white/15 transition font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <PremiumModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
