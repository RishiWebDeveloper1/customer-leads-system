const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <table style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id}>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td className="button-del-edit">
              <button onClick={() => onEdit(u)}>Edit</button>
              <button onClick={() => onDelete(u._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;