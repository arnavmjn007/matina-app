import { Input } from 'antd';

const ContactStep = ({ data, setFormData }) => {
    // A single handler can now update both fields inside the userProfile object
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            userProfile: {
                ...prev.userProfile,
                [name]: value
            }
        }));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">What's your contact info?</h2>
            <div className="space-y-4">
                <Input
                    addonBefore="+977"
                    size="large"
                    placeholder="Phone Number (98...)"
                    name="phone" // must match the key in the state object
                    value={data.userProfile.phone}
                    onChange={handleChange}
                />
                <Input
                    size="large"
                    placeholder="Address (e.g., Kathmandu, Nepal)"
                    name="address" // must match the key in the state object
                    value={data.userProfile.address}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default ContactStep;