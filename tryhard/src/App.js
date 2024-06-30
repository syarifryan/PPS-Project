// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import AddItem from './components/AddItem';
import UpdateItem from './components/UpdateItem';
import LostReportForm from './components/LostReportForm';
import LostReports from './components/LostReports';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory/*" element={<Inventory />} />
            <Route path="/inventory/add" element={<AddItem />} />
            <Route path="/inventory/update/:id" element={<UpdateItem />} />
            <Route path="/lost-report" element={<LostReportForm />} />
            <Route path="/lost-reports/*" element={<LostReports />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
