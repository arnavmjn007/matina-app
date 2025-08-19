import { Radio } from 'antd';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';

const GenderStep = ({ data, setFormData }) => (
    <div>
        <h2 className="text-3xl font-bold mb-6">How do you identify?</h2>
        <Radio.Group 
            onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))} 
            value={data.gender} 
            size="large" 
            className="w-full"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Radio.Button value="man" className="h-16 flex items-center justify-center text-lg rounded-lg"><ManOutlined className="mr-2" />Man</Radio.Button>
                <Radio.Button value="woman" className="h-16 flex items-center justify-center text-lg rounded-lg"><WomanOutlined className="mr-2" />Woman</Radio.Button>
            </div>
        </Radio.Group>
    </div>
);
export default GenderStep;