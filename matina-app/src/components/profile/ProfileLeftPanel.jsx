import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileLeftPanel = ({ userProfile }) => {
  const traits = [
    { name: "Love", value: userProfile.love, description: "loving and affectionate" },
    { name: "Care", value: userProfile.care, description: "caring and compassionate" },
    { name: "Cute", value: userProfile.cute, description: "charming and adorable" },
  ];

  let maxTrait = traits[0];
  for (let i = 1; i < traits.length; i++) {
    if (traits[i].value > maxTrait.value) {
      maxTrait = traits[i];
    }
  }

  const infoMessage = `${userProfile.name} seems to be a ${maxTrait.description} kind of person.`;

  return (
    <motion.section
      initial={{ x: '-150%' }}
      animate={{ x: 0 }}
      exit={{ x: '-150%' }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-6 rounded-2xl shadow-lg flex flex-col justify-between bg-white text-gray-800 h-full"
    >
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2">
          {userProfile.name} <span className="text-pink-600">{userProfile.lastName}</span>
        </h2>
        <p className="text-xl md:text-2xl font-semibold text-gray-600 mb-2">{userProfile.age} y</p>
        <p className="text-gray-500 text-lg mb-4 leading-relaxed">{userProfile.bio}</p>

        <hr className="my-4 border-gray-200" />

        {userProfile.about && userProfile.about.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">About {userProfile.name}</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.about.map((item, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center space-x-1"
                >
                  {item.icon && <span className="text-base">{item.icon}</span>}
                  <span>{item.text}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6 mb-4">
          <div className="flex items-center">
            <span className="font-medium w-24">Love</span>
            <div className="flex-1 bg-gray-200 rounded-full h-7 relative">
              <div
                className="bg-red-500 h-7 rounded-full"
                style={{ width: `${userProfile.love}%` }}
              ></div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-white">
                {userProfile.love}%
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="font-medium w-24">Care</span>
            <div className="flex-1 bg-gray-200 rounded-full h-7 relative">
              <div
                className="bg-pink-500 h-7 rounded-full"
                style={{ width: `${userProfile.care}%` }}
              ></div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-white">
                {userProfile.care}%
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="font-medium w-24">Cute</span>
            <div className="flex-1 bg-gray-200 rounded-full h-7 relative">
              <div
                className="bg-purple-500 h-7 rounded-full"
                style={{ width: `${userProfile.cute}%` }}
              ></div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-white">
                {userProfile.cute}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-blue-800 bg-blue-100 p-3 rounded-xl text-sm mt-6">
          <Info className="w-5 h-5 mr-2" />
          <span>{infoMessage}</span>
        </div>
      </div>
    </motion.section>
  );
};

export default ProfileLeftPanel;