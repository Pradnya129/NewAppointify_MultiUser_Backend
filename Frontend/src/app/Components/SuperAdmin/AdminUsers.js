"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;

    axios
      .get(`http://localhost:5000/api/superadmin/manageAdmins/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error('Error fetching users:', err));

      console.log(users)
  }, [token]);

  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    if (!selectedUser) return;
    const token = localStorage.getItem('token');

    axios
      .patch(
        `http://localhost:5000/api/it-users/${selectedUser.id}`,
        selectedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setUsers(users.map((u) => (u.id === selectedUser.id ? res.data : u)));
        setShowModal(false);
        setSelectedUser(null);
      })
      .catch((err) => {
        console.error('Error updating user:', err);
        alert('Failed to update user');
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/superadmin/manageAdmins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUsers(users.filter((u) => u.id !== id));
      })
      .catch((err) => console.error('Error deleting user:', err));
  };

  return (
    <div className="card p-3 rounded-4 mt-5">
      <div className="card-header  border-bottom mb-3">
        <h5 className="mb-0">IT Users</h5>
      </div>

      {/* Table for larger screens */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-bordered table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Sr. No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Business</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id || index}>
                <td>{index + 1}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.businessName}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(user)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile screens */}
      <div className="d-block d-md-none">
        {users.map((user, index) => (
          <div key={user.id || index} className="card mb-3 shadow-sm border rounded-lg p-3">
            <h6 className="fw-bold mb-2">
              #{index + 1} - {user.firstName} {user.lastName}
            </h6>
            <p className="mb-1"><strong>Email:</strong> {user.email}</p>
            <p className="mb-1"><strong>Phone:</strong> {user.phoneNumber}</p>
            <p className="mb-1"><strong>Business:</strong> {user.businessName}</p>
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(user)}>
                <FaEdit /> Edit
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for editing */}
      {showModal && selectedUser && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser.firstName}
                      onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser.lastName}
                      onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser.phoneNumber}
                      onChange={(e) => setSelectedUser({ ...selectedUser, phoneNumber: e.target.value })}
                    />
                  </div>

                  <div className="text-center mt-3">
                    <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
