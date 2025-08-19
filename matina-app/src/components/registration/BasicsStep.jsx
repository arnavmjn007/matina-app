import { Plus } from 'lucide-react';

const BasicsStep = ({ basicsItems, openEditModal }) => (
    <div>
        <h2 className="text-3xl font-bold mb-6">My Basics</h2>
        <div className="space-y-2">
            {basicsItems.map(item => (
                <button key={item.key} onClick={() => openEditModal(item)} className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 text-left">
                    <div className="flex items-center text-gray-600">{item.icon}<span className="ml-4 text-md font-semibold text-gray-800">{item.label}</span></div>
                    <div className="flex items-center"><span className="text-md text-gray-500 mr-2">{item.value || ''}</span><Plus className="text-gray-400" size={20} /></div>
                </button>
            ))}
        </div>
    </div>
);
export default BasicsStep;