import { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "../component/UserForm";
import UserTable from "../component/UserTable";
import './Admin.css'

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/users`);
            console.log("Fetched Users:", res.data);
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await axios.get("http://localhost:3000/users/logs");
            console.log("Fetched Logs:", res.data);
            setActivityLogs(res.data);
        } catch (err) {
            console.error("Error fetching logs:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchLogs();
    }, []);

    const handleCreate = () => {
        setSelectedUser(null);
        setShowForm(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowForm(true);
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure?")) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchUsers();
        }
    };

    const handleFormSubmit = async () => {
        setShowForm(false);
        fetchUsers();
    };

    return (
        <div className="admin-container">
        <div style={{ padding: 20 }}>
            <h2>Admin Panel</h2>
            <button onClick={handleCreate}>+ Create User</button>
            <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
            {showForm && (
                <UserForm
                    user={selectedUser}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
            <h3 style={{ marginTop: 40 }}>Activity Logs</h3>
            <ul>
                {activityLogs.map((log, index) => (
                    <li key={index}>{log.message} — {new Date(log.timestamp).toLocaleString()}</li>
                ))}
            </ul>
        </div>
        </div>
    );
};

export default Admin;