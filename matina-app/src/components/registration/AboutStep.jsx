import { Input, Select } from 'antd';
import { INTEREST_OPTIONS, WANTS_TO_OPTIONS } from '../../config/registrationConstants';

const { TextArea } = Input;
const { Option } = Select;

const AboutStep = ({ data, setFormData }) => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-6">And finally...</h2>

        <div>
            <label className="font-semibold text-gray-700">A short bio...</label>
            <TextArea
                rows={4}
                placeholder="Tell us something interesting!"
                value={data.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            />
        </div>

        <div>
            <label className="font-semibold text-gray-700">My interests are...</label>
            <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Add interests"
                value={data.interests}
                onChange={(val) => setFormData(prev => ({ ...prev, interests: val }))}
            >
                {INTEREST_OPTIONS.map(opt => <Option key={opt}>{opt}</Option>)}
            </Select>
        </div>

        <div>
            <label className="font-semibold text-gray-700">I want to...</label>
            <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Add your intentions"
                value={data.wantsTo}
                onChange={(val) => setFormData(prev => ({ ...prev, wantsTo: val }))}
            >
                {WANTS_TO_OPTIONS.map(opt => <Option key={opt}>{opt}</Option>)}
            </Select>
        </div>
    </div>
);

export default AboutStep;