import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';

const UploadPage = () => {
    const navigate = useNavigate();

    const handleDataLoaded = (data) => {
        navigate('/results', { state: { data } });
    };

    return <FileUpload onDataLoaded={handleDataLoaded} />;
};

export default UploadPage;
