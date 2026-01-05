import { Home, Users, BookOpen, LogOut, User } from 'lucide-react'; // 'User' icon added here

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <div className="mb-8 text-2xl font-bold text-center text-pink-400">Admin Panel</div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              {/* This is now a button, which is the correct semantic element for this type of action */}
              <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              {/* Converted to a button */}
              <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <Users className="w-5 h-5" />
                <span>Students</span>
              </button>
            </li>
            <li>
              {/* Converted to a button */}
              <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <BookOpen className="w-5 h-5" />
                <span>Blogs</span>
              </button>
            </li>
            {/* Add more admin navigation links here as needed */}
          </ul>
        </nav>
        <div className="mt-auto">
          {/* Logout button converted from an anchor tag */}
          <button className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-red-700 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="bg-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Content</h1>
          {/* Admin user info/settings can go here */}
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-gray-600" />
            <span className="text-gray-700">Admin User</span>
          </div>
        </header>

        {/* The 'children' prop will render the content of the admin page
              that uses this layout (e.g., Dashboard, Blog). */}
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
