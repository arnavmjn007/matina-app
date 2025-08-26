import { useState } from 'react';
import { MapPin, Zap } from 'lucide-react';
// FIX: Remove the unused 'Button' import
import { Modal } from 'antd';

const SuperlikeModal = ({ isOpen, closeModal, userName }) => (
  <Modal open={isOpen} onCancel={closeModal} centered footer={null} width={450}>
    <div className="p-6 text-center">
      <Zap className="w-16 h-16 text-blue-500 mb-4 mx-auto" fill="currentColor" />
      <h1 className="text-3xl font-bold">Send a Superlike?</h1>
      <p className="mt-2 text-gray-500">Let {userName} know they're special.</p>
    </div>
  </Modal>
);

function ProfileRightPanel({ userProfile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="p-6 rounded-2xl shadow-lg bg-white h-full flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {userProfile.interests?.map((interest, index) => (
              <span key={index} className="bg-pink-100 text-pink-800 text-md font-medium px-3 py-1 rounded-full">
                {interest}
              </span>
            ))}
          </div>

          <hr className="my-4" />

          <h3 className="text-2xl font-bold mb-4">Wants to</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {userProfile.wantsTo?.map((item, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-md font-medium px-3 py-1 rounded-full">
                {item}
              </span>
            ))}
          </div>

          <hr className="my-4" />
          <h3 className="text-2xl font-bold mb-4">Location</h3>
          <div className="flex items-center text-lg text-gray-600">
            <MapPin className="w-6 h-6 mr-2 text-pink-500" />
            <span>{userProfile.userProfile?.address}</span>
          </div>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="mt-8 w-full bg-pink-400 hover:bg-pink-500 text-white
 font-bold py-3 rounded-full">
          Send a Superlike
        </button>
      </section>

      <SuperlikeModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        userName={userProfile.firstName}
      />
    </>
  );
}

export default ProfileRightPanel;