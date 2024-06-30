// src/components/AddItem.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddItem.css';

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    details: '',
    location: '',
    date: '',
    image: ''
  });

  const navigate = useNavigate();

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
    fetch('http://localhost:5000/api/items', {
      method: 'POST',
      body: data
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        navigate('/inventory'); // Redirect to inventory page
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="add-item-form">
      <h2>Add Temuan</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nama Barang
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Isi nama barang" />
        </label>
        <label>
          Identitas Pemilik
          <input type="text" name="owner" value={formData.owner} onChange={handleChange} placeholder="Kosongi jika tidak ada" />
        </label>
        <label>
          Detail Barang
          <input type="text" name="details" value={formData.details} onChange={handleChange} placeholder="Isi detail barang" />
        </label>
        <label>
          Tempat Ditemukan
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Isi tempat ditemukan" />
        </label>
        <label>
          Tanggal Ditemukan
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </label>
        <label>
          Upload Foto
          <input type="file" name="image" onChange={handleFileChange} />
        </label>
        <div className="form-buttons">
          <button type="button" className="back-button" onClick={() => navigate('/inventory')}>Back</button>
          <button type="submit" className="submit-button">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
