import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const PhotosStep = ({ setFormData }) => (
    <div>
        <h2 className="text-3xl font-bold mb-6">Upload your best photos</h2>
        <Upload.Dragger
            multiple
            listType="picture-card"
            beforeUpload={() => false}
            onChange={(info) => setFormData(prev => ({ ...prev, photos: info.fileList }))}
        >
            <p className="ant-upload-drag-icon"><UploadOutlined /></p>
            <p className="ant-upload-text">Click or drag files</p>
        </Upload.Dragger>
    </div>
);

export default PhotosStep;