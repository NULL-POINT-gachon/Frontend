import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNoticeForm from "./AdminNoticeForm";

const AdminNoticeCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    console.log("공지 등록:", data);
    navigate("/admin/notices");
  };

  return <AdminNoticeForm onSubmit={handleSubmit} />;
};

export default AdminNoticeCreate;