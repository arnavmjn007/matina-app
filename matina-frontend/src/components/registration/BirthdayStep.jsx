import { DatePicker } from 'antd';
import dayjs from 'dayjs'; // It's good practice to handle date objects with dayjs

const BirthdayStep = ({ data, setFormData }) => (
    <div>
        <h2 className="text-3xl font-bold mb-6">When is your birthday?</h2>
        <DatePicker
            size="large"
            style={{ width: '100%' }}
            // Ensure the value is a dayjs object if it exists, otherwise null
            value={data.userProfile.birthday ? dayjs(data.userProfile.birthday) : null}
            onChange={(date) =>
                setFormData(prev => ({
                    ...prev,
                    userProfile: { ...prev.userProfile, birthday: date }
                }))
            }
        />
    </div>
);

export default BirthdayStep;