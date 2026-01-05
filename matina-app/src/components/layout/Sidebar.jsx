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
      <Star
        className="w-16 h-16 text-yellow-400 mx-auto mb-4"
        fill="currentColor"
      />
      <h1 className="text-4xl font-bold font-display mb-4 text-gray-800">
        Matina Gold
      </h1>

      <ul className="text-left mb-6 space-y-2 text-gray-700">
        {[
          "Unlimited matches",
          "See profile viewers",
          "Unlimited messages",
          "Boost profile visibility",
          "Premium badge",
          "Priority support",
        ].map((item) => (
          <li key={item} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" /> {item}
          </li>
        ))}
      </ul>

      <Button
        type="primary"
        size="large"
        block
        style={{ backgroundColor: "#F472B6", borderColor: "#F472B6" }}
      >
        Upgrade Now – Rs. 999 / month
      </Button>
    </div>
  </Modal>
);

const Sidebar = ({ navigateTo, currentPage, activeUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAge = (birthday) => {
    if (!birthday) return "";
    return new Date().getFullYear() - new Date(birthday).getFullYear();
  };

  return (
    <>
      <aside
        className="
        w-64 hidden md:flex flex-col justify-between h-full
        bg-gradient-to-b from-pink-400 via-pink-500 to-rose-500
        text-white p-6 rounded-r-3xl shadow-2xl
      "
      >
        {/* TOP */}
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/images/hearts.png" alt="Matina" className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-wide">Matina</span>
          </div>

          {/* User */}
          {activeUser && (
            <div
              className="
              flex items-center gap-3 mb-6 p-3
              rounded-2xl bg-white/15 backdrop-blur
            "
            >
              <img
                src={activeUser.images?.[0]?.imageUrl}
                alt={activeUser.firstName}
                className="w-12 h-12 rounded-full object-cover border border-white/30"
              />
              <div>
                <p className="font-semibold leading-tight">
                  {activeUser.firstName},{" "}
                  {getAge(activeUser.userProfile?.birthday)}
                </p>
                <p className="text-xs text-white/70">View profile</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => navigateTo(item.page)}
                    className={`
                      flex items-center gap-3 w-full px-4 py-3 rounded-xl
                      transition-all duration-200
                      ${
                        currentPage === item.page
                          ? "bg-white text-pink-600 shadow-lg"
                          : "text-white/80 hover:bg-white/20 hover:text-white"
                      }
                    `}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="space-y-4">
          {/* Spotlight */}
          <div
            className="
            p-4 rounded-2xl text-center
            bg-white/20 backdrop-blur
          "
          >
            <Sparkle className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
            <p className="text-sm font-semibold mb-2">Spotlight Feature</p>
            <p className="text-xs text-white/80 mb-4">
              Get noticed by premium members first
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="
                w-full py-2 rounded-lg
                bg-yellow-400 text-gray-900 font-bold
                hover:bg-yellow-500 transition
              "
            >
              Learn More
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => navigateTo("logout")}
            className="
              flex items-center gap-3 w-full px-4 py-3 rounded-xl
              text-white/90"
          >
            <LogOut size={20} />
            <span>Logout</span>
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
