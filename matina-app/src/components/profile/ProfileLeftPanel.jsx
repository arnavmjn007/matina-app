import { motion } from 'framer-motion';
import {
  Ruler, Dumbbell, GraduationCap, GlassWater, Cigarette, Heart,
  Baby, Sparkles, Landmark, Church, Info
} from 'lucide-react';

const ProfileLeftPanel = ({ userProfile }) => {
  const getAge = (birthday) => {
    if (!birthday) return '';
    return new Date().getFullYear() - new Date(birthday).getFullYear();
  };

  const traits = [
    { name: "Love", value: userProfile.userPersonality?.love || 50, color: 'bg-red-400', description: "loving and affectionate" },
    { name: "Care", value: userProfile.userPersonality?.care || 50, color: 'bg-purple-400', description: "caring and compassionate" },
    { name: "Cute", value: userProfile.userPersonality?.cute || 50, color: 'bg-pink-400', description: "charming and adorable" },
  ];

  const basics = [
    { icon: <Ruler size={16} />, value: userProfile.userBasics?.height },
    { icon: <Dumbbell size={16} />, value: userProfile.userBasics?.exercise },
    { icon: <GraduationCap size={16} />, value: userProfile.userBasics?.education },
    { icon: <GlassWater size={16} />, value: userProfile.userBasics?.drinking },
    { icon: <Cigarette size={16} />, value: userProfile.userBasics?.smoking },
    { icon: <Heart size={16} />, value: userProfile.userBasics?.lookingFor },
    { icon: <Baby size={16} />, value: userProfile.userBasics?.kids },
    { icon: <Sparkles size={16} />, value: userProfile.userBasics?.starSign },
    { icon: <Landmark size={16} />, value: userProfile.userBasics?.politics },
    { icon: <Church size={16} />, value: userProfile.userBasics?.religion },
  ];

  // Logic to find the trait with the highest score
  const maxTrait = traits.reduce(
    (max, trait) => (trait.value > max.value ? trait : max),
    traits[0]
  );

  const infoMessage = `${userProfile.firstName} seems like a ${maxTrait.description} kind of person.`;

  return (
    <motion.section
      initial={{ x: '-150%' }}
      animate={{ x: 0 }}
      exit={{ x: '-150%' }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="p-6 rounded-2xl shadow-lg bg-white h-full flex flex-col justify-between"
    >
      <div>
        <h2 className="text-4xl font-extrabold mb-2">
          {userProfile.firstName} <span className="text-green-500">{userProfile.lastName}</span>
        </h2>
        <p className="text-2xl font-semibold text-gray-600 mb-4">
          {getAge(userProfile.userProfile?.birthday)} y
        </p>
        <p className="text-gray-500 text-lg">{userProfile.userProfile?.bio}</p>

        <hr className="my-4" />

        <div className="flex flex-wrap gap-2 mb-6">
          {basics.map((item, index) => (
            item.value && (
              <div key={index} className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-2 rounded-full flex items-center">
                {item.icon}
                <span className="ml-2">{item.value}</span>
              </div>
            )
          ))}
        </div>

        <div className="space-y-4">
          {traits.map(trait => (
            <div key={trait.name} className="flex items-center">
              <span className="font-semibold w-16 text-lg">{trait.name}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                <div
                  className={`${trait.color} h-8 rounded-full flex items-center justify-end pr-3`}
                  style={{ width: `${trait.value}%` }}
                >
                  <span className="text-md font-bold text-white">
                    {trait.value}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center text-blue-800 bg-blue-100 p-3 rounded-xl text-sm mt-6">
        <Info className="w-5 h-5 mr-2 flex-shrink-0" />
        <span>{infoMessage}</span>
      </div>
    </motion.section>
  );
};
export default ProfileLeftPanel;