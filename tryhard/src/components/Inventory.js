import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useResolvedPath, useLocation, useNavigate } from 'react-router-dom';
import AddItem from './AddItem';
import UpdateItem from './UpdateItem';
import axios from 'axios';
import './Inventory.css';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const resolvedPath = useResolvedPath('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/items')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  const handleDelete = id => {
    axios.delete(`http://localhost:5000/api/items/${id}`)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  const handleEdit = id => {
    navigate(`/inventory/update/${id}`);
  };

  return (
    <div className="inventory">
      <h2>Inventory Barang Temuan</h2>
      <Link to={`${resolvedPath.pathname}/add`} className="add-item">Add Temuan</Link>
      <Routes location={location}>
        <Route index element={
          <div className="item-grid">            
            {items.map(item => (
              <div key={item.id} className="item-card">
                <img src={`http://localhost:5000${item.image}`} alt={item.name} />
                <div className="item-info">
                  <p>{item.name}</p>
                  <button className="edit-button" onClick={() => handleEdit(item.id)}>EDIT</button>
                  <button className="delete-button" onClick={() => handleDelete(item.id)}>DELETE</button>
                </div>
              </div>
            ))}
          </div>
        } />
        <Route path="add" element={<AddItem />} />
        <Route path="update/:id" element={<UpdateItem />} />
      </Routes>
    </div>
  );
};

export default Inventory;
