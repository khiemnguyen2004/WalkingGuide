import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import { getTags, createTag, updateTag, deleteTag } from "../../api/tagApi";

function TagsAdmin() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const res = await getTags();
    setTags(res.data);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createTag({ name });
    setName("");
    fetchTags();
  };

  const handleEdit = (tag) => {
    setEditId(tag.id);
    setName(tag.name);
    
    // Scroll to top of the page to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async () => {
    if (!name.trim()) return;
    await updateTag(editId, { name });
    setEditId(null);
    setName("");
    fetchTags();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thẻ này?")) {
      await deleteTag(id);
      fetchTags();
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-row" style={{ background: "#f6f8fa" }}>
      <AdminSidebar alwaysExpanded />
      <div className="flex-grow-1 d-flex flex-column admin-dashboard" style={{ marginLeft: 220, minHeight: "100vh", padding: 0, background: "#f6f8fa" }}>
        <AdminHeader />
        <main className="flex-grow-1" style={{ padding: 0, maxWidth: "100%", width: "100%", margin: 0 }}>
          <div className="admin-dashboard-cards-row">
            <div className="container py-4">
              <h2>Quản lý thẻ địa điểm</h2>
              <div className="mb-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Tên thẻ"
                />
                {editId ? (
                  <>
                    <button onClick={handleUpdate} className="btn admin-main-btn me-2">Cập nhật</button>
                    <button onClick={() => { setEditId(null); setName(""); }} className="btn admin-btn-secondary">Hủy</button>
                  </>
                ) : (
                  <button onClick={handleCreate} className="btn admin-main-btn">Thêm</button>
                )}
              </div>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên thẻ</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag) => (
                    <tr key={tag.id}>
                      <td>{tag.id}</td>
                      <td>{tag.name}</td>
                      <td>
                        <button className="btn admin-main-btn btn-sm me-2" onClick={() => handleEdit(tag)}>Sửa</button>
                        <button className="btn admin-btn-danger btn-sm" onClick={() => handleDelete(tag.id)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TagsAdmin;
