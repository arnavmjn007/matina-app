import { useState } from 'react';
import { Modal, Radio, Button, Slider } from 'antd';
import { Plus } from 'lucide-react';
import { getBasicsItems } from '../../../config/registrationConstants';

const BasicsTab = ({ formData, setFormData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [modalValue, setModalValue] = useState('');

    const openEditModal = (item) => {
        setEditingItem(item);
        setModalValue(formData.basics?.[item.key] || '');
        setIsModalVisible(true);
    };

    const handleSaveModal = () => {
        setFormData(prev => ({
            ...prev,
            basics: { ...prev.basics, [editingItem.key]: modalValue }
        }));
        setIsModalVisible(false);
    };

    const handleSkipModal = () => {
        setIsModalVisible(false);
    };

    const renderModalContent = () => {
        if (!editingItem) return null;

        if (editingItem.type === 'height') {
            const heightInCm = parseInt(modalValue.split(' ')[0], 10) || 170;
            return (
                <div className="flex flex-col items-center p-6">
                    <p className="text-xl font-bold mb-4">What is your height?</p>
                    <div className="text-2xl font-semibold text-pink-500 mb-4">{heightInCm} cm</div>
                    <Slider
                        min={120}
                        max={220}
                        onChange={(value) => setModalValue(`${value} cm`)}
                        value={heightInCm}
                        className="w-full"
                    />
                    <div className="flex justify-between w-full mt-2 text-sm text-gray-500">
                        <span>120 cm</span>
                        <span>220 cm</span>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center p-6">
                    <p className="text-xl font-bold mb-4">{`What is your ${editingItem.label}?`}</p>
                    <Radio.Group
                        onChange={(e) => setModalValue(e.target.value)}
                        value={modalValue}
                        className="flex flex-col space-y-2 w-full"
                    >
                        {editingItem.options.map(opt => (
                            <Radio.Button key={opt} value={opt} className="w-full h-12 flex items-center justify-center">{opt}</Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
            );
        }
    };

    const basicsItems = getBasicsItems(formData.basics);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Your Basics</h2>
            <div className="space-y-2">
                {basicsItems.map(item => (
                    <button
                        key={item.key}
                        onClick={() => openEditModal(item)}
                        className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 text-left"
                    >
                        <div className="flex items-center text-gray-600">
                            {item.icon}
                            <span className="ml-4 text-md font-semibold text-gray-800">{item.label}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-md text-gray-500 mr-2">{formData.basics?.[item.key] || ''}</span>
                            <Plus className="text-gray-400" size={20} />
                        </div>
                    </button>
                ))}
            </div>

            <Modal
                title={null}
                open={isModalVisible}
                onOk={handleSaveModal}
                onCancel={handleSkipModal}
                centered
                footer={[
                    <Button key="back" onClick={handleSkipModal}>Skip</Button>,
                    <Button key="submit" type="primary" onClick={handleSaveModal}>Save</Button>,
                ]}
            >
                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default BasicsTab;