import Sidebar from '../../layout/Sidebar';

const FrontendLayout = ({ children, navigateTo, currentPage, activeUser }) => {
    return (
        // This container sets the boundary to the full screen height and prevents the whole page from scrolling.
        <div className="flex h-screen overflow-hidden bg-gray-100">
            
            {/* Your Sidebar component fits inside this container. */}
            <Sidebar navigateTo={navigateTo} currentPage={currentPage} activeUser={activeUser}  />

            {/* This main content area is set to scroll vertically if its content is too long. */}
            <main className="flex-grow p-8 sm:p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

export default FrontendLayout;
