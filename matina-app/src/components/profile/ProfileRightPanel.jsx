import { useState } from 'react';
import { MapPin, Zap } from 'lucide-react';
import { Modal, Button } from 'antd';
import 'antd/dist/reset.css';

// New Modal Component for the Superlike feature
const SuperlikeModal = ({ isOpen, closeModal, userName }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={closeModal}
      centered
      footer={null}
      width={450}
    >
      <div className="p-6 text-center">
        <div className="flex flex-col items-center text-gray-800">
          <Zap className="w-16 h-16 text-blue-500 mb-4" fill="currentColor" />
          <h1 className="text-3xl font-bold font-display">Send a Superlike?</h1>
          <p className="mt-2 text-gray-500">
            You're 3x more likely to get a match! Let {userName} know they're special.
          </p>
        </div>
        <div className="mt-8 flex flex-col space-y-3">
          <Button type="primary" size="large" block style={{ backgroundColor: '#3B82F6', borderColor: '#3B82F6', fontWeight: 'bold' }}>
            Send Superlike
          </Button>
          <p className="text-sm text-gray-400">Purchase the premium model to access this feature.</p>
        </div>
      </div>
    </Modal>
  );
};


function ProfileRightPanel({ userProfile }) {
  // State to control the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="p-6 rounded-2xl shadow-lg flex flex-col justify-between bg-white text-gray-800 h-full">
        <div>
          <h3 className="text-2xl font-bold mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {userProfile.interests.map((interest, index) => (
              <span
                key={index}
                className="bg-pink-500/10 text-pink-800 text-lg font-medium px-4 py-2 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>

          <hr className="my-4 border-gray-200" />

          <h3 className="text-2xl font-bold mb-4">Wants to</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {userProfile.wantsTo.map((item, index) => (
              <span
                key={index}
                className="bg-blue-500/10 text-blue-800 text-lg font-medium px-4 py-2 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>

          <hr className="my-4 border-gray-200" />

          <h3 className="text-2xl font-bold mb-4">Location</h3>
          <div className="flex items-center text-lg text-gray-600">
            <MapPin className="w-6 h-6 mr-2 text-pink-500" />
            <span>{userProfile.location}</span>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)} // This button now opens the modal
          className="mt-8 w-full bg-pink-500 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 transform hover:scale-105">
          Send a superlike?
        </button>
      </section>

      {/* Render the Ant Design modal */}
      <SuperlikeModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        userName={userProfile.name}
      />
    </>
  );
}

export default ProfileRightPanel;
