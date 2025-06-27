import { useState, useEffect } from "react";
import axios from "axios";
import "./SubAdmin.css";

const SubAdmin = () => {
  const [leads, setLeads] = useState([]);
  const [lead, setLead] = useState(initialLead());
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState("");

  function initialLead() {
    return {
      _id: null,
      name: "",
      email: "",
      phone: "",
      source: "",
      status: "New",
      tags: "",
      notes: "",
      assignedTo: "agent@support.com",
    };
  }

  const handleChange = (e) => {
    setLead({ ...lead, [e.target.name]: e.target.value });
  };

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/leads`);
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        ...lead,
        tags: lead.tags.split(",").map((t) => t.trim()),
      };

      if (isEdit) {
        await axios.put(`${import.meta.env.VITE_API_URL}/leads-update/${lead._id}`, payload);
        setMessage("✅ Lead updated successfully!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/leads-create`, payload);
        setMessage("✅ Lead created successfully!");
      }

      setLead(initialLead());
      setIsEdit(false);
      fetchLeads();
    } catch (err) {
      console.error("Save lead failed", err);
      setMessage("❌ Failed to save lead");
    }
  };

  const handleEdit = (lead) => {
    setLead({
      ...lead,
      tags: lead.tags?.join(", ") || "",
    });
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/leads-delete/${id}`);
      setMessage("🗑️ Lead deleted");
      fetchLeads();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="subadmin-wrapper">
      <h2>SubAdmin Panel - Manage Leads</h2>

      {message && <p className="message">{message}</p>}

      <form className="lead-form" onSubmit={handleSubmit}>
        <input name="name" value={lead.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={lead.email} onChange={handleChange} placeholder="Email" required />
        <input name="phone" value={lead.phone} onChange={handleChange} placeholder="Phone" required />
        <input name="source" value={lead.source} onChange={handleChange} placeholder="Source" required />
        <select name="status" value={lead.status} onChange={handleChange}>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
          <option value="Won">Won</option>
        </select>
        <input name="tags" value={lead.tags} onChange={handleChange} placeholder="Tags (comma separated)" />
        <textarea name="notes" value={lead.notes} onChange={handleChange} placeholder="Notes" />
        <button type="submit">{isEdit ? "✏️ Update Lead" : "➕ Create Lead"}</button>
      </form>

      <h3>📋 All Leads</h3>
      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l._id}>
              <td>{l.name}</td>
              <td>{l.email}</td>
              <td>{l.status}</td>
              <td>{l.tags?.join(", ")}</td>
              <td>
                <button onClick={() => handleEdit(l)}>Edit</button>
                <button onClick={() => handleDelete(l._id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubAdmin;
