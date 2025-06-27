import { useState, useEffect } from "react";
import axios from "axios";
import "./AllLeads.css";

const AllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [tagFilter, setTagFilter] = useState("");

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/leads`, {
        params: tagFilter ? { tag: tagFilter } : {},
      });
      setLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [tagFilter]);

  const uniqueTags = Array.from(
    new Set(leads.flatMap((lead) => lead.tags))
  );

  return (
    <div className="leads-container">
      <h2>All Leads</h2>

      <div className="filter">
        <label>Filter by Tag: </label>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="">All</option>
          {uniqueTags.map((tag, idx) => (
            <option key={idx} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Source</th>
            <th>Status</th>
            <th>Tags</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{lead.source}</td>
              <td>{lead.status}</td>
              <td>{lead.tags.join(", ")}</td>
              <td>{lead.assignedTo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllLeads;