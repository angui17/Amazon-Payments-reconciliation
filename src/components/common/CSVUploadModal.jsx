import React, { useState, useRef } from 'react';

const CSVUploadModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.txt'))) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            alert('File uploaded successfully!');
            onClose();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="csv-upload-modal active">
      <div className="csv-upload-content">
        <div className="csv-upload-header">
          <h3>Upload Amazon CSV File</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        
        <div className="csv-upload-body">
          <div 
            className="file-upload-area"
            onClick={() => fileInputRef.current.click()}
          >
            <h3>Select CSV File</h3>
            <p>Drag & drop your Amazon settlement report CSV file here or click to browse</p>
            <p className="kpi-label">Expected format: Settlement report from Amazon Seller Central</p>
            <button className="btn btn-primary" style={{ marginTop: '15px' }}>
              <span>📁</span> Browse File
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden-file-input" 
              accept=".csv,.txt"
              onChange={handleFileSelect}
            />
          </div>

          {selectedFile && (
            <div style={{ marginTop: '20px' }}>
              <h4>Selected File</h4>
              <p><strong>File Name:</strong> {selectedFile.name}</p>
              <p><strong>File Size:</strong> {formatFileSize(selectedFile.size)}</p>
              <p><strong>File Type:</strong> {selectedFile.type || 'text/csv'}</p>
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '15px' }}
                onClick={simulateUpload}
                disabled={isUploading}
              >
                <span>🚀</span> Process File
              </button>
            </div>
          )}

          {isUploading && (
            <div className="csv-upload-progress" style={{ marginTop: '20px' }}>
              <h4>Processing Progress</h4>
              <div className="progress-info">
                <span>Processing CSV file...</span>
                <span className="progress-percentage">{uploadProgress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVUploadModal;