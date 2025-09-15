// src/features/admin/AdminLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar bên trái */}
      <Sidebar />
      {/* Nội dung trang */}
      <main className="admin-content">
        <Outlet /> {/* Render trang con (Dashboard, Products, Orders, v.v.) */}
      </main>
    </div>
  );
};

export default AdminLayout;
