import { useEffect, useState } from 'react';
import { Modal, Input, Slider, Radio, Button } from 'antd';

const BasicsEditModal = ({ isOpen, onCancel, item, onSave }) => {
    // Manages the value *inside* the modal temporarily
    const [currentValue, setCurrentValue] = useState(item?.value);

    // This effect resets the modal's internal state whenever a new item is passed in
    useEffect(() => {
        setCurrentValue(item?.value);
    }, [item]);

    // Renders the correct input type based on the item's properties
    const renderInput = () => {
        if (!item) return null;
        switch (item.type) {
            case 'height':
                const numValue = parseInt(currentValue) || 170;
                return (
                    <>
                        <div className="text-center text-2xl font-bold mb-4">{currentValue || `${numValue} cm`}</div>
                        <Slider min={120} max={220} value={numValue} onChange={(val) => setCurrentValue(`${val} cm`)} />
                    </>
                );
            case 'radio':
                return (
                    <Radio.Group onChange={(e) => setCurrentValue(e.target.value)} value={currentValue} className="flex flex-col space-y-3">
                        {item.options.map(opt => <Radio.Button key={opt} value={opt} className="rounded-full text-center h-12 flex items-center justify-center">{opt}</Radio.Button>)}
                    </Radio.Group>
                );
            default:
                return <Input value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />;
        }
    };

    // When the user clicks save, this sends the data back to the parent component
    const handleSave = () => {
        onSave(item.key, currentValue); // Calls the onSave function from props
        onCancel(); // Closes the modal
    };

    return (
        <Modal open={isOpen} onCancel={onCancel} centered footer={null} width={400}>
            <div className="p-6 text-center">
                <div className="flex justify-center text-yellow-500 mb-4">{item?.icon}</div>
                <h2 className="text-2xl font-bold mb-6">What is your {item?.label.toLowerCase()}?</h2>
                {renderInput()}
                <div className="mt-8 flex flex-col space-y-2">
                    <Button type="primary" size="large" block onClick={handleSave} className="bg-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 text-black font-bold">
                        {item?.type === 'height' ? "Yep, that's how tall I am" : "Save"}
                    </Button>
                    <Button size="large" block onClick={onCancel}>Skip</Button>
                </div>
            </div>
        </Modal>
    );
};

export default BasicsEditModal;