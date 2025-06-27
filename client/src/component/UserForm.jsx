import { useState } from "react";
import axios from "axios";

const UserForm = ({ user, onClose, onSubmit }) => {
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const isEdit = Boolean(user?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/users-update/${user._id}`, { email });
    } else {
        await axios.post(`http://localhost:3000/users-create`, { email, password });
    }
    
    onSubmit(); // refresh user list
    } catch (err) {
      alert("Failed to save user.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h3>{isEdit ? "Edit" : "Create"} Sub-Admin</h3>
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {!isEdit && (
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}
      <button type="submit">{isEdit ? "Update" : "Create"}</button>
      <button onClick={onClose} type="button">Cancel</button>
    </form>
  );
};

export default UserForm;
