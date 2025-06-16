import { useEffect, useState } from "react";
import axios from "axios";

function UserPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Lỗi khi tải user:", err));
  }, []);

  return (
    <div>
      <h1>Danh sách người dùng</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.full_name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserPage;