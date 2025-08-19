import { Input } from 'antd';

const ContactStep = ({ data, setFormData }) => (
    <div>
        <h2 className="text-3xl font-bold mb-6">What's your phone number?</h2>
        <Input
            addonBefore="+977"
            size="large"
            placeholder="98********"
            name="phone"
            value={data.phone}
            onChange={(e) =>
                setFormData(prev => ({ ...prev, phone: e.target.value }))
            }
        />
    </div>
);

export default ContactStep;