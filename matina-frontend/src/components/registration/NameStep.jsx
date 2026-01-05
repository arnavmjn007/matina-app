import { Input } from 'antd';

const NameStep = ({ data, setFormData }) => {
    // This handler works for any top-level property in the state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">What's your name?</h2>
            <div className="space-y-4">
                <Input
                    size="large"
                    placeholder="First Name"
                    name="firstName"
                    value={data.firstName}
                    onChange={handleChange}
                />
                <Input
                    size="large"
                    placeholder="Last Name"
                    name="lastName"
                    value={data.lastName}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default NameStep;