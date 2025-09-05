"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/superadmin/coupons";

const Coupans = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    code: "",
    discountType: "percentage",
    discountValue: "",
    maxUsage: "",
    expiresAt: "",
  });

  // ✅ Get token helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // ✅ Fetch coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get(API_BASE, { headers: getAuthHeaders() });
      setCoupons(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ✅ Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Save (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`${API_BASE}/${form.id}`, form, {
          headers: getAuthHeaders(),
        });
        alert("Coupon updated!");
      } else {
        await axios.post(API_BASE, form, { headers: getAuthHeaders() });
        alert("Coupon created!");
      }
      setForm({
        id: null,
        code: "",
        discountType: "percentage",
        discountValue: "",
        maxUsage: "",
        expiresAt: "",
      });
      fetchCoupons();
    } catch (err) {
      console.error(err);
      alert("Failed to save coupon");
    }
  };

  // ✅ Edit
  const handleEdit = (coupon) => {
    setForm(coupon);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
      alert("Coupon deleted!");
      fetchCoupons();
    } catch (err) {
      console.error(err);
      alert("Failed to delete coupon");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
        <h2 className="mb-4">Coupons</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded">
          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                name="code"
                placeholder="Code"
                className="form-control"
                value={form.code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <select
                name="discountType"
                className="form-control"
                value={form.discountType}
                onChange={handleChange}
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="discountValue"
                placeholder="Discount"
                className="form-control"
                value={form.discountValue}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                name="maxUsage"
                placeholder="Max Usage"
                className="form-control"
                value={form.maxUsage}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                name="expiresAt"
                className="form-control"
                value={form.expiresAt?.split("T")[0] || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            {form.id ? "Update" : "Create"} Coupon
          </button>
        </form>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Max Usage</th>
                <th>Used</th>
                <th>Expires</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td>{c.code}</td>
                  <td>{c.discountType}</td>
                  <td>{c.discountValue}</td>
                  <td>{c.maxUsage}</td>
                  <td>{c.usedCount}</td>
                  <td>{new Date(c.expiresAt).toLocaleDateString()}</td>
                  <td>{c.isActive ? "✅" : "❌"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(c.id)}
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

export default Coupans;
