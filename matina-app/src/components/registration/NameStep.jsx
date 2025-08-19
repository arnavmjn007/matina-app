import { Input } from 'antd';

const NameStep = ({ data, handleInputChange }) => (
    <div>
        <h2 className="text-3xl font-bold mb-6">What's your name?</h2>
        <div className="space-y-4">
            <Input size="large" placeholder="First Name" name="firstName" value={data.firstName} onChange={handleInputChange} />
            <Input size="large" placeholder="Last Name" name="lastName" value={data.lastName} onChange={handleInputChange} />
        </div>
    </div>
);
export default NameStep;