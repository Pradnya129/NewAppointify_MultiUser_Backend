"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/superAdmin/sub_plans"; // ✅ Update with your actual API

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    planName: "",
    monthlyPrice: "",
    annualPrice: "",
    renewalLimit: "",
    features: "",
    description: "",
  });

  // ✅ Get token headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // ✅ Fetch plans
  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all`, { headers: getAuthHeaders() });
      setPlans(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ✅ Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Save (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        features: JSON.stringify(form.features.split(",").map((f) => f.trim())),
      };

      if (form.id) {
        await axios.put(`${API_BASE}/${form.id}`, payload, {
          headers: getAuthHeaders(),
        });
        alert("Plan updated!");
      } else {
        await axios.post(`${API_BASE}/add`, payload, { headers: getAuthHeaders() });
        alert("Plan created!");
      }

      setForm({
        id: null,
        planName: "",
        monthlyPrice: "",
        annualPrice: "",
        renewalLimit: "",
        features: "",
        description: "",
      });

      fetchPlans();
    } catch (err) {
      console.error(err);
      alert("Failed to save plan");
    }
  };

  // ✅ Edit
  const handleEdit = (plan) => {
    setForm({
      ...plan,
      features: JSON.parse(plan.features).join(", "),
    });
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
      alert("Plan deleted!");
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert("Failed to delete plan");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
        <h2 className="mb-4">Subscription Plans</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded">
          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                name="planName"
                placeholder="Plan Name"
                className="form-control"
                value={form.planName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="monthlyPrice"
                placeholder="Monthly Price"
                className="form-control"
                value={form.monthlyPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="annualPrice"
                placeholder="Annual Price"
                className="form-control"
                value={form.annualPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="renewalLimit"
                placeholder="Renewal Limit"
                className="form-control"
                value={form.renewalLimit}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                name="features"
                placeholder="Features (comma separated)"
                className="form-control"
                value={form.features}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-12 mt-2">
              <textarea
                name="description"
                placeholder="Description"
                className="form-control"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            {form.id ? "Update" : "Create"} Plan
          </button>
        </form>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Monthly Price</th>
                <th>Annual Price</th>
                <th>Renewal Limit</th>
                <th>Features</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id}>
                  <td>{p.planName}</td>
                  <td>{p.monthlyPrice}</td>
                  <td>{p.annualPrice}</td>
                  <td>{p.renewalLimit}</td>
                  <td>{JSON.parse(p.features).join(", ")}</td>
                  <td>{p.description}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Plans;
