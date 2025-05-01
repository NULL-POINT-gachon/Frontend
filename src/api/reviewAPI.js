// src/api/reviewAPI.js
import axios from "axios";

// 기본 경로 (나중에 실제 백엔드 주소로 변경)
const BASE_URL = "/api/reviews";

// 전체 리뷰 조회
export const getAllReviews = async () => {
  return await axios.get(BASE_URL);
};

// 리뷰 상세 조회
export const getReviewById = async (id) => {
  return await axios.get(`${BASE_URL}/${id}`);
};

// 리뷰 삭제
export const deleteReview = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};

// 리뷰 승인 처리 (예: 상태 변경 API가 있을 경우)
export const approveReview = async (id) => {
  return await axios.patch(`${BASE_URL}/${id}/approve`);
};

// 리뷰 내용 수정
export const updateReview = async (id, data) => {
  return await axios.put(`${BASE_URL}/${id}`, data);
};
