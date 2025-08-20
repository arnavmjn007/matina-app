import { motion } from 'framer-motion';

const ProfileLeftPanel = ({ userProfile }) => {
  const getAge = (birthday) => {
    if (!birthday) return '';
    return new Date().getFullYear() - new Date(birthday).getFullYear();
  };

  const traits = [
    { name: "Love", value: userProfile.userPersonality?.love || 50 },
    { name: "Care", value: userProfile.userPersonality?.care || 50 },
    { name: "Cute", value: userProfile.userPersonality?.cute || 50 },
  ];

  return (
    <motion.section
      initial={{ x: '-150%' }}
      animate={{ x: 0 }}
      exit={{ x: '-150%' }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-6 rounded-2xl shadow-lg bg-white h-full"
    >
      <h2 className="text-4xl font-extrabold mb-2">
        {userProfile.firstName} <span className="text-pink-500">{userProfile.lastName}</span>
      </h2>
      <p className="text-2xl font-semibold text-gray-600 mb-4">
        {getAge(userProfile.userProfile?.birthday)}
      </p>
      <p className="text-gray-500 text-lg">{userProfile.userProfile?.bio}</p>
      <hr className="my-4" />
      <div className="space-y-6">
        {traits.map(trait => (
          <div key={trait.name} className="flex items-center">
            <span className="font-medium w-16">{trait.name}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div className="bg-pink-500 h-6 rounded-full" style={{ width: `${trait.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default ProfileLeftPanel;