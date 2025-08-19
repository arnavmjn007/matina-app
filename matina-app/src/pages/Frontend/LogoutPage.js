import React, { useEffect } from 'react';
function LogoutPage({ navigateTo }) {
  // In a real app, you would perform actual logout logic here (e.g., clear session, redirect)
  useEffect(() => {
    // Simulate a logout process
    const timer = setTimeout(() => {
      console.log("User logged out.");
      // Optionally redirect to login page or home after logout
      // navigateTo('admin-login'); // Example: redirect to admin login after logout
    }, 1000); // Simulate a 1-second logout process

    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Logging Out...</h1>
        <p className="text-lg text-gray-600">You are being securely logged out of your account.</p>
        <button
          onClick={() => navigateTo('discovery')}
          className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-pink-600 transition-colors"
        >
          Back to Discovery
        </button>
      </div>
  );
}

export default LogoutPage;