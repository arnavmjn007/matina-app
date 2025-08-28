import Sidebar from '../layout/Sidebar';

const SidebarLayout = ({ children, navigateTo, currentPage }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-rose-50">
            {/* Sidebar */}
            <Sidebar navigateTo={navigateTo} currentPage={currentPage}  />
            {/* Main Content */}
            <main className="flex-grow p-8 sm:p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

export default SidebarLayout;
