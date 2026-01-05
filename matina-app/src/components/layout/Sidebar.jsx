import { useMemo, useState } from "react";
import {
  Heart,
  MessageSquare,
  Compass,
  Settings,
  LogOut,
  Sparkle,
  Star,
  Check,
  User2,
} from "lucide-react";
import { Modal, Button, Dropdown } from "antd";

const navItems = [
  { name: "Discovery", icon: <Compass size={18} />, page: "discovery", guestOk: true },
  { name: "Liked", icon: <Heart size={18} />, page: "liked", guestOk: false },
  { name: "Chats", icon: <MessageSquare size={18} />, page: "chats", guestOk: false },
  { name: "Settings", icon: <Settings size={18} />, page: "settings", guestOk: false },
];

const PremiumModal = ({ isOpen, closeModal }) => (
  <Modal open={isOpen} onCancel={closeModal} centered footer={null} width={450}>
    <div className="p-6 text-center">
      <div className="flex flex-col items-center text-slate-900">
        <Star className="w-16 h-16 text-amber-400 mb-4" fill="currentColor" />
        <h1 className="text-4xl font-bold font-display mb-4">Matina Gold</h1>
        <ul className="text-left mb-6 space-y-2 text-slate-700">
          {[
            "Access to unlimited matches",
            "See who viewed your profile",
            "Send unlimited messages",
            "Boost your profile visibility",
            "Exclusive premium badge",
            "Priority customer support",
          ].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-500" /> {t}
            </li>
          ))}
        </ul>
      </div>
      <Button type="primary" size="large" block style={{ backgroundColor: "#F59E0B", color: "#0F172A" }}>
        Upgrade Now - Rs. 999/month
      </Button>
    </div>
  </Modal>
);

const Sidebar = ({ navigateTo, currentPage, activeUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isGuest = !activeUser;

  const age = useMemo(() => {
    const b = activeUser?.userProfile?.birthday;
    if (!b) return "";
    const a = new Date().getFullYear() - new Date(b).getFullYear();
    return a > 0 ? a : "";
  }, [activeUser]);

  const profileMenuItems = [
    {
      key: "settings",
      label: "Settings",
      icon: <Settings size={16} />,
      onClick: () => navigateTo("settings"),
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogOut size={16} />,
      onClick: () => navigateTo("logout"),
    },
  ];

  const handleNav = (item) => {
    if (!item.guestOk && isGuest) {
      // Guest cannot open these pages
      navigateTo("login"); // or open auth modal in your app
      return;
    }
    navigateTo(item.page);
  };

  return (
    <>
      <aside className="w-72 hidden md:flex flex-shrink-0 h-full p-5">
        <div className="w-full rounded-3xl bg-white shadow-xl border border-rose-100 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white">
            <div className="flex items-center gap-3">
              <img src="/images/hearts.png" alt="Matina Logo" className="w-8 h-8" />
              <div>
                <div className="text-2xl font-bold leading-tight">Matina</div>
                <div className="text-xs text-white/80">Modern dating, less chaos</div>
              </div>
            </div>

            {/* User chip */}
            <div className="mt-4">
              {isGuest ? (
                <div className="flex items-center gap-3 bg-white/15 rounded-2xl p-3">
                  <div className="w-11 h-11 rounded-full bg-white/25 flex items-center justify-center">
                    <User2 />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Guest mode</div>
                    <div className="text-xs text-white/80">Browse freely. Actions need login.</div>
                  </div>
                </div>
              ) : (
                <Dropdown
                  menu={{ items: profileMenuItems }}
                  trigger={["click"]}
                  placement="bottomLeft"
                >
                  <button className="w-full flex items-center gap-3 bg-white/15 hover:bg-white/20 transition rounded-2xl p-3 text-left">
                    <img
                      src={activeUser.images?.[0]?.imageUrl}
                      alt={activeUser.firstName}
                      className="w-11 h-11 rounded-full object-cover bg-white/20"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/48x48/334155/FFFFFF?text=U";
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-semibold leading-tight">
                        {activeUser.firstName} {age ? `, ${age}` : ""}
                      </div>
                      <div className="text-xs text-white/80">Tap for menu</div>
                    </div>
                  </button>
                </Dropdown>
              )}
            </div>
          </div>

          {/* Nav */}
          <div className="p-4 flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const disabled = isGuest && !item.guestOk;
                const active = currentPage === item.page;
                return (
                  <li key={item.page}>
                    <button
                      onClick={() => handleNav(item)}
                      className={[
                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition text-sm font-semibold",
                        active
                          ? "bg-rose-50 text-rose-700 border border-rose-100"
                          : "text-slate-700 hover:bg-slate-50",
                        disabled ? "opacity-60" : "",
                      ].join(" ")}
                    >
                      <span className={active ? "text-rose-600" : "text-slate-500"}>{item.icon}</span>
                      <span className="flex-1">{item.name}</span>
                      {disabled && <span className="text-xs text-slate-400">Login</span>}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Spotlight */}
            <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-100 rounded-2xl">
              <div className="flex items-start gap-3">
                <Sparkle className="w-7 h-7 text-amber-500 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Spotlight</div>
                  <div className="text-xs text-slate-600 mt-1">
                    Get your profile noticed by premium members.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 w-full py-2 rounded-xl font-bold text-slate-900 bg-amber-300 hover:bg-amber-400 transition text-sm"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="p-4 border-t border-slate-100">
            {isGuest ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigateTo("login")}
                  className="w-full py-2.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigateTo("register")}
                  className="w-full py-2.5 rounded-xl font-bold bg-rose-500 text-white hover:bg-rose-600 transition"
                >
                  Create account
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo("logout")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 transition border border-slate-200"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>

      <PremiumModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
    </>
  );
};

export default Sidebar;
