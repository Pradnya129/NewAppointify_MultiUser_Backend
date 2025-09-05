import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
import { jwtDecode } from "jwt-decode";

const ConsultantSection4 = () => {
  const [stats, setStats] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // 🔽 Fetch stats on component mount
useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatusMessage({ type: "error", text: "No token found. Please log in." });
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,   // 👈 include token
        },
      });

      const apiStats = response.data.map(stat => ({
        ...stat,
        editedValue: stat.value.replace("%", ""),
        editedDescription: stat.description || "", // fallback if empty
      }));

      setStats(apiStats);
      setStatusMessage({ type: "", text: "" });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStatusMessage({ type: "error", text: "Error fetching stats." });
    }
  };

  fetchStats();
}, []);


  const handleStatChange = (index, newValue) => {
    const updatedStats = [...stats];
    updatedStats[index].editedValue = newValue;
    setStats(updatedStats);
  };

  const handleDescChange = (index, newDesc) => {
    const updatedStats = [...stats];
    updatedStats[index].editedDescription = newDesc;
    setStats(updatedStats);
  };

  const handleDirectionChange = (index, newDirection) => {
    const updatedStats = [...stats];
    updatedStats[index].icon = newDirection;
    setStats(updatedStats);
  };

  const handleSave = (index, value) => {
    const updatedStats = [...stats];
    const stat = updatedStats[index];

    // Validate Value: Must not be empty or non-numeric
    if (!stat.editedValue || isNaN(stat.editedValue) || stat.editedValue <= 0) {
      setStatusMessage({ type: 'error', text: 'Value must be a positive number.' });
      return;
    }

    // Validate Description: Must not be empty
    if (!stat.editedDescription.trim()) {
      setStatusMessage({ type: 'error', text: 'Description cannot be empty.' });
      return; // Prevent save if description is empty
    }

    const dataToSend = {
      id: stat.id,
      value: stat.editedValue ? stat.editedValue + '%' : stat.value,
      description: stat.editedDescription || '',  // Allow empty description if it is cleared
      icon: stat.icon,
    };

    axios.put(`http://localhost:5000/api/admin/stats/${stat.id}`, dataToSend)
      .then(() => {
        // Update local state after successful save
        stat.value = dataToSend.value;
        stat.description = dataToSend.description;
        setStats(updatedStats);
        setStatusMessage({ type: 'success', text: `Stat ${value} updated successfully!` });
      })
      .catch((error) => {
        console.error('Error updating stat:', error);
        setStatusMessage({ type: 'error', text: 'Error updating stat' });
      });
  };

  return (
    <div>
      <h5 className="text-start mb-3 text-muted mt-5">Section 4 - Manage Stats</h5>
      {statusMessage.text && (
        <div className={`alert ${statusMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {statusMessage.text}
        </div>
      )}
      <div className="card p-4 shadow-sm mt-4">
        <div className="row">
          {stats.map((stat, index) => (
            <div key={stat.id} className="col-md-4 mb-5">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <h2 className="fw-bold d-flex align-items-center justify-content-center" style={{ gap: '8px' }}>
                      <i
                        className={`bi ${
                          stat.icon === 'up' ? 'bi-arrow-up-short text-success' : 'bi-arrow-down-short text-danger'
                        }`}
                        style={{ fontSize: '1.5rem' }}
                      ></i>
                      <span className={stat.icon === 'up' ? 'text-success' : 'text-danger'}>{stat.value}</span>
                    </h2>
                    <p className="text-muted">{stat.description}</p>
                  </div>

                  <div className="form-group mb-3 text-start">
                    <label className="form-label">Update Value</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 50"
                      value={stat.editedValue || stat.value}
                      onChange={(e) => handleStatChange(index, e.target.value)}
                    />
                    <button className="btn btn-outline-success mt-2 w-100" onClick={() => handleSave(index, "Value")}>
                      Save Value
                    </button>
                  </div>

                  <div className="form-group mb-3 text-start">
                    <label className="form-label">Trend Direction</label>
                    <select
                      className="form-select"
                      value={stat.icon}
                      onChange={(e) => handleDirectionChange(index, e.target.value)}
                    >
                      <option value="up">Up</option>
                      <option value="down">Down</option>
                    </select>
                  </div>

                  <div className="form-group text-start">
                    <label className="form-label">Update Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Write new description"
                      value={stat.editedDescription || ""}
                      onChange={(e) => handleDescChange(index, e.target.value)}
                    ></textarea>
                    <button className="btn btn-primary mt-2 w-100" onClick={() => handleSave(index, "Description")}>
                      Save Description
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultantSection4;
