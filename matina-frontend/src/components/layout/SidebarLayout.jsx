import Sidebar from "../layout/Sidebar";

const SidebarLayout = ({ children, navigateTo, currentPage }) => {
  return (
    <div className="min-h-screen bg-rose-50">
      <div className="flex min-h-screen">
        <Sidebar navigateTo={navigateTo} currentPage={currentPage} />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
