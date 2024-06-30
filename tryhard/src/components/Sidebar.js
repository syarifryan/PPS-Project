// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/L.png" alt="Lost and Found" />
      </div>
      <nav>
        <ul>
          <li className="active"><Link to="/">Dashboard</Link></li>
          <li><Link to="/lost-report">Form Laporan Hilang</Link></li>
          <li><Link to="/inventory">Inventory Barang Temuan</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
