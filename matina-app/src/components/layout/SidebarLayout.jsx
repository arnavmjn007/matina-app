import Sidebar from "../layout/Sidebar";

const SidebarLayout = ({ children, navigateTo, currentPage, user }) => {
  return (
    <div className="flex min-h-dvh bg-rose-50">
      {/* Sidebar */}
      <div className="hidden md:block h-dvh sticky top-0">
        <Sidebar
          navigateTo={navigateTo}
          currentPage={currentPage}
          activeUser={user}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-h-dvh overflow-y-auto p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
