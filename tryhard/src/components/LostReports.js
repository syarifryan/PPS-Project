// src/components/LostReports.js
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useResolvedPath, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LostReportForm from './LostReportForm';
import './Inventory.css';

const LostReports = () => {
  const [reports, setReports] = useState([]);
  const resolvedPath = useResolvedPath('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/reports')
      .then(response => setReports(response.data))
      .catch(error => console.error('Error fetching reports:', error));
  }, []);

  const handleDelete = id => {
    axios.delete(`http://localhost:5000/api/reports/${id}`)
      .then(() => {
        setReports(reports.filter(report => report.id !== id));
      })
      .catch(error => console.error('Error deleting report:', error));
  };

  const handleEdit = id => {
    navigate(`/lost-reports/update/${id}`);
  };

  return (
    <div className="inventory">
      <h2>Laporan Kehilangan</h2>
      <Link to={`${resolvedPath.pathname}/add`} className="add-item">Add Report</Link>
      <Routes location={location}>
        <Route index element={
          <div className="item-grid">            
            {reports.map(report => (
              <div key={report.id} className="item-card">
                <img src={`http://localhost:5000${report.image}`} alt={report.name} />
                <div className="item-info">
                  <p>{report.name}</p>
                  <button className="edit-button" onClick={() => handleEdit(report.id)}>EDIT</button>
                  <button className="delete-button" onClick={() => handleDelete(report.id)}>DELETE</button>
                </div>
              </div>
            ))}
          </div>
        } />
        <Route path="add" element={<LostReportForm />} />
        {/* Tambahkan komponen untuk update laporan */}
      </Routes>
    </div>
  );
};

export default LostReports;
