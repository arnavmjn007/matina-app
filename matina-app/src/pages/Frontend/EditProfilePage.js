function EditProfilePage({ navigateTo }) {
  return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Edit Profile</h1>
        <p className="text-lg text-gray-600">This is where users can edit their profile details.</p>
        <button
          onClick={() => navigateTo('discovery')}
          className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-pink-600 transition-colors"
        >
          Back to Discovery
        </button>
      </div>
  );
}

export default EditProfilePage;