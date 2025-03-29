import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${id}`);
      fetchUsers(); // refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Start editing
  const startEdit = (user) => {
    setEditingUserId(user._id);
    setEditedData(user);
  };

  // Save edits
  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/user/${editingUserId}`, editedData);
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      <h2>Saved Users</h2>
      <button onClick={onBack}>← Back to Form</button>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "20px", width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th><th>Age</th><th>Heart Rate</th><th>Sweat Rate</th><th>Body Temp</th><th>Email</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) =>
              editingUserId === user._id ? (
                <tr key={user._id}>
                  <td><input value={editedData.name} onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} /></td>
                  <td><input value={editedData.age} onChange={(e) => setEditedData({ ...editedData, age: e.target.value })} /></td>
                  <td><input value={editedData.heartRate} onChange={(e) => setEditedData({ ...editedData, heartRate: e.target.value })} /></td>
                  <td><input value={editedData.sweatRate} onChange={(e) => setEditedData({ ...editedData, sweatRate: e.target.value })} /></td>
                  <td><input value={editedData.bodyTemperature} onChange={(e) => setEditedData({ ...editedData, bodyTemperature: e.target.value })} /></td>
                  <td><input value={editedData.email} onChange={(e) => setEditedData({ ...editedData, email: e.target.value })} /></td>
                  <td>
                    <button onClick={saveEdit}>💾 Save</button>
                    <button onClick={() => setEditingUserId(null)}>❌ Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.heartRate}</td>
                  <td>{user.sweatRate}</td>
                  <td>{user.bodyTemperature}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => startEdit(user)}>✏️ Edit</button>
                    <button onClick={() => deleteUser(user._id)}>🗑 Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
