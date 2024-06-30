import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './UpdateItem.css';

const UpdateItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    details: '',
    location: '',
    date: '',
    image: null // Perubahan untuk mendukung pengunggahan file
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/items/${id}`)
      .then(response => setFormData({
        ...response.data,
        image: null // Set image ke null agar tidak ada masalah dengan file yang sudah ada
      }))
      .catch(error => console.error('Error fetching item:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('owner', formData.owner);
    data.append('details', formData.details);
    data.append('location', formData.location);
    data.append('date', formData.date);
    if (formData.image) {
      data.append('image', formData.image);
    }

    axios.put(`http://localhost:5000/api/items/${id}`, data)
      .then(() => {
        navigate('/inventory');
      })
      .catch(error => console.error('Error updating item:', error));
  };

  return (
    <div>
      <h2>Update Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="owner"
          value={formData.owner}
          onChange={handleChange}
          placeholder="Owner"
        />
        <input
          type="text"
          name="details"
          value={formData.details}
          onChange={handleChange}
          placeholder="Details"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
        />
        <button type="submit">Update</button>
        <button type="button" onClick={() => navigate('/inventory')}>Back</button>
      </form>
    </div>
  );
};

export default UpdateItem;
