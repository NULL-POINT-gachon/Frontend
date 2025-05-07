import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNoticeForm from "./AdminNoticeForm";
import { dummyNotices } from "./dummyNotices";

const AdminNoticeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notice = dummyNotices.find((n) => n.id === Number(id));

  const handleSubmit = (data) => {
    console.log("수정된 공지사항 데이터:", data);
    navigate("/admin/notices");
  };

  return <AdminNoticeForm initialData={notice} onSubmit={handleSubmit} />;
};

export default AdminNoticeEdit;