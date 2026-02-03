import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';

const FileUpload = ({ onDataLoaded }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFile = async (file) => {
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Please upload a valid CSV file');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setFileName(file.name);

        try {
            const data = await parseCSV(file);
            setTimeout(() => {
                onDataLoaded(data);
                setIsProcessing(false);
            }, 800);
        } catch (err) {
            setError(err.message || 'Failed to parse CSV');
            setIsProcessing(false);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card text-center" style={{ maxWidth: '600px', width: '100%', margin: '0 auto', transition: 'all 0.3s ease' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 1.5rem',
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.1)'
                    }}>
                        <FileText size={32} color="var(--color-primary)" strokeWidth={1.5} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1f2937', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
                        Supplier Rate Analyzer
                    </h1>
                    <p className="subtitle" style={{ fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
                        Upload your CSV to visualize quotes and generate insights instantly.
                    </p>
                </div>

                <div
                    className={`drop-zone ${isDragging ? 'active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        padding: '3rem 2rem'
                    }}
                >
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        id="file-upload"
                        style={{ display: 'none' }}
                    />

                    <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                        <div className="flex flex-col items-center justify-center gap-4">
                            {!isProcessing ? (
                                <>
                                    <div style={{
                                        backgroundColor: isDragging ? '#e0e7ff' : '#f3f4f6',
                                        padding: '1.25rem',
                                        borderRadius: '50%',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        <Upload size={32} color={isDragging ? 'var(--color-primary)' : '#9ca3af'} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#374151', marginBottom: '0.5rem' }}>
                                            {isDragging ? 'Drop it like it\'s hot!' : 'Click to upload or drag & drop'}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                            Supported format: .CSV (Max 10MB)
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center animate-pulse">
                                    <div style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                                        <div className="spinner" style={{
                                            border: '3px solid #e5e7eb',
                                            borderTop: '3px solid var(--color-primary)',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                    </div>
                                    <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Crunching the numbers...</p>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{fileName}</p>
                                </div>
                            )}
                        </div>
                    </label>

                    <style>{`
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}</style>
                </div>

                {error && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#fef2f2',
                        borderRadius: '12px',
                        color: '#b91c1c',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.9rem',
                        border: '1px solid #fecaca'
                    }}>
                        <AlertCircle size={20} />
                        <span style={{ fontWeight: 500 }}>{error}</span>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.6 }}>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Secure • Encrypted • Local Processing
                </p>
            </div>
        </div>
    );
};

export default FileUpload;