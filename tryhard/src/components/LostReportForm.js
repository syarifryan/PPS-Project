// src/components/LostReportForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddItem.css';

const LostReportForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: '',
    nrp: '',
    faculty: '',
    details: '',
    location: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    fetch('http://localhost:5000/api/reports', {
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        navigate('/lost-reports');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="add-item-form">
      <h2>Laporan Kehilangan</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nama
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Isi nama" />
        </label>
        <label>
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Isi email" />
        </label>
        <label>
          Nomor Handphone
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Isi nomor handphone" />
        </label>
        <label>
          Status
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="">Pilih status</option>
            <option value="Mahasiswa">Mahasiswa</option>
            <option value="Staf">Staf</option>
            <option value="Dosen">Dosen</option>
            <option value="Pengguna umum">Pengguna umum</option>
          </select>
        </label>
        {(formData.status === 'Mahasiswa' || formData.status === 'Staf' || formData.status === 'Dosen') && (
          <>
            <label>
              NRP
              <input type="text" name="nrp" value={formData.nrp} onChange={handleChange} placeholder="Isi NRP" />
            </label>
            <label>
              Fakultas
              <input type="text" name="faculty" value={formData.faculty} onChange={handleChange} placeholder="Isi fakultas" />
            </label>
          </>
        )}
        <label>
          Detail Barang
          <input type="text" name="details" value={formData.details} onChange={handleChange} placeholder="Isi detail barang" />
        </label>
        <label>
          Tempat Kehilangan
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Isi tempat kehilangan" />
        </label>
        <label>
          Upload Foto Barang
          <input type="file" name="image" onChange={handleFileChange} />
        </label>
        <div className="form-buttons">
          <button type="button" className="back-button" onClick={() => navigate('/lost-reports')}>Back</button>
          <button type="submit" className="submit-button">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default LostReportForm;
