import Sidebar from '../layout/Sidebar';

const SidebarLayout = ({ children, navigateTo, currentPage }) => {
    return (
        // This container now uses h-screen and overflow-hidden to fix the scrolling.
        <div className="flex h-screen overflow-hidden bg-gray-100">
            
            {/* Your Sidebar component fits inside this container. */}
            <Sidebar navigateTo={navigateTo} currentPage={currentPage} />

            {/* This main content area is set to scroll vertically if its content is too long. */}
            <main className="flex-grow p-8 sm:p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

export default SidebarLayout;
