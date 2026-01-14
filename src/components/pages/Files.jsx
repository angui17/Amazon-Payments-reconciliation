import React, { useState } from 'react';
import CSVUploadModal from '../../components/common/CSVUploadModal';
import '../../styles/dashboard.css';

const Files = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const files = [
    {
      name: 'settlement_report_0925.csv',
      type: 'CSV',
      size: '2.4 MB',
      uploaded: '2025-09-20 10:15',
      status: 'Processed',
      progress: 100
    },
    {
      name: 'amazon_orders_0920.tsv',
      type: 'TSV',
      size: '1.8 MB',
      uploaded: '2025-09-20 09:30',
      status: 'Processing',
      progress: 65
    },
    {
      name: 'payment_data_0919.xlsx',
      type: 'Excel',
      size: '3.1 MB',
      uploaded: '2025-09-19 16:45',
      status: 'Failed',
      progress: 30
    }
  ];

  return (
    <>
      <div className="main-content page active" id="files-page">
        <div className="content-header">
          <h1>File Management</h1>
          <p>Upload and manage reconciliation files</p>
        </div>

        <div className="kpi-cards">
          <div className="kpi-card">
            <div>Files Processed</div>
            <div className="kpi-value">234</div>
            <div className="kpi-label">This month</div>
          </div>
          <div className="kpi-card">
            <div>Pending Files</div>
            <div className="kpi-value">12</div>
            <div className="kpi-label">In queue</div>
          </div>
          <div className="kpi-card">
            <div>Success Rate</div>
            <div className="kpi-value">96%</div>
            <div className="kpi-label">Processing efficiency</div>
          </div>
        </div>

        <div 
          className="file-upload-area" 
          id="file-upload-area"
          onClick={() => setIsModalOpen(true)}
        >
          <h3>Upload Files for Processing</h3>
          <p>Drag & drop your CSV, TSV, or Excel files here or click to browse</p>
          <p className="kpi-label">Supported formats: .csv, .tsv, .xlsx, .xls</p>
          <button className="btn btn-primary" style={{marginTop: '15px'}}>
            <span>📁</span> Browse Files
          </button>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h3>Recent Files</h3>
            <div className="table-actions">
              <button className="btn btn-outline">Refresh</button>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                Upload New
              </button>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr key={index}>
                    <td>{file.name}</td>
                    <td>{file.type}</td>
                    <td>{file.size}</td>
                    <td>{file.uploaded}</td>
                    <td>
                      <span className={`status-badge status-${file.status.toLowerCase()}`}>
                        {file.status}
                      </span>
                    </td>
                    <td>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${file.progress}%`}}></div>
                      </div>
                    </td>
                    <td className="action-buttons">
                      <button className="action-btn action-view">View</button>
                      <button className="action-btn action-edit">
                        {file.status === 'Failed' ? 'Retry' : 'Download'}
                      </button>
                      {file.status === 'Processing' && (
                        <button className="action-btn action-delete">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CSVUploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Files;