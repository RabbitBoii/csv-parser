import { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DataTable from '../components/DataTable';

const TablePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state?.data || [];

    useEffect(() => {
        if (!data || data.length === 0) {
            navigate('/');
        }
    }, [data, navigate]);

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="container" style={{ margin: '2rem auto' }}>
            <div className="mb-4">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 btn-primary"
                    style={{ background: 'transparent', color: 'var(--color-primary)', paddingLeft: 0 }}
                >
                    <ArrowLeft size={20} /> Back to Upload
                </button>
            </div>

            <DataTable data={data} />
        </div>
    );
};

export default TablePage;
