import { DatePicker } from 'antd';

const BirthdayStep = ({ data, setFormData }) => (
    <div>
        <h2 className="text-3xl font-bold mb-6">When is your birthday?</h2>
        <DatePicker
            size="large"
            style={{ width: '100%' }}
            value={data.birthday}
            onChange={(date) => setFormData(prev => ({ ...prev, birthday: date }))}
        />
    </div>
);
export default BirthdayStep;