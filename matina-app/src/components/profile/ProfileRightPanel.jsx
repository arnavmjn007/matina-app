import { useState } from "react";
import { MapPin, Zap } from "lucide-react";
// FIX: Remove the unused 'Button' import
import { Modal } from "antd";

const SuperlikeModal = ({ isOpen, closeModal, userName }) => (
  <Modal open={isOpen} onCancel={closeModal} centered footer={null} width={450}>
    <div className="p-6 text-center">
      <Zap
        className="w-16 h-16 text-blue-500 mb-4 mx-auto"
        fill="currentColor"
      />
      <h1 className="text-3xl font-bold">Send a Superlike?</h1>
      <p className="mt-2 text-gray-500">Let {userName} know they're special.</p>
    </div>
  </Modal>
);

function ProfileRightPanel({ userProfile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="p-5 sm:p-6 rounded-2xl shadow-lg bg-white h-full min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.interests?.map((interest, index) => (
              <span
                key={index}
                className="bg-pink-100 text-pink-800 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>

          <hr className="my-5" />

          <h3 className="text-xl sm:text-2xl font-bold mb-3">Wants to</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.wantsTo?.map((item, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>

          <hr className="my-5" />
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Location</h3>
          <div className="flex items-center text-sm sm:text-base text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-pink-500" />
            <span>{userProfile.userProfile?.address}</span>
          </div>
          <div className="h-4" />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 w-full
            bg-gradient-to-r from-pink-500 to-fuchsia-500
            hover:from-pink-600 hover:to-fuchsia-600
            text-white font-bold
            py-3 rounded-full
            shadow-md hover:shadow-lg
            transition"
        >
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
