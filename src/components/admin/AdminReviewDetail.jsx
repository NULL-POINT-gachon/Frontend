import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  VStack,
  Badge,
  HStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const AdminReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchReview = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "로그인이 필요합니다",
          description: "관리자 페이지 접근을 위해 로그인해주세요.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:3000/admin/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setReview(response.data.data);
      }
    } catch (error) {
      console.error("리뷰 상세 정보 가져오기 오류:", error);
      toast({ 
        title: "리뷰 불러오기 실패", 
        description: error.response?.data?.message || "리뷰를 불러오는데 실패했습니다.",
        status: "error" 
      });
      
      if (error.response) {
        if (error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else if (error.response.status === 403) {
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:3000/admin/reviews/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast({ 
          title: "리뷰 상태 변경 완료", 
          description: newStatus === 1 ? "리뷰가 활성화되었습니다." : "리뷰가 비활성화되었습니다.",
          status: "success" 
        });
        fetchReview(); // 리뷰 정보 새로고침
      }
    } catch (error) {
      toast({ 
        title: "리뷰 상태 변경 실패", 
        description: error.response?.data?.message || "리뷰 상태 변경에 실패했습니다.",
        status: "error" 
      });
    }
  };

  if (loading) return <Spinner mt={10} />;

  if (!review)
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="lg" color="red.500" mb={4}>
          해당 리뷰를 찾을 수 없습니다.
        </Text>
        <Button onClick={() => navigate(-1)}>돌아가기</Button>
      </Box>
    );

  return (
    <Box p={6}>
      <Heading size="md" mb={4}>리뷰 상세 정보</Heading>
      <VStack align="start" spacing={3}>
        <Text><strong>작성자:</strong> {review.user_name}</Text>
        <Text><strong>장소:</strong> {review.destination_name}</Text>
        <Text><strong>작성일:</strong> {new Date(review.created_at).toLocaleDateString()}</Text>
        <Text><strong>내용:</strong> {review.review_content}</Text>
        <Text><strong>평점:</strong> {"⭐".repeat(review.rating)} ({review.rating})</Text>
        <Text>
          <strong>상태:</strong>{" "}
          {review.status === 1 ? (
            <Badge colorScheme="green">활성화</Badge>
          ) : (
            <Badge colorScheme="red">비활성화</Badge>
          )}
        </Text>
      </VStack>

      <HStack spacing={4} mt={6}>
        <Button 
          colorScheme={review.status === 1 ? "red" : "green"} 
          onClick={() => handleStatusChange(review.status === 1 ? 0 : 1)}
        >
          {review.status === 1 ? "비활성화" : "활성화"}
        </Button>
        <Button onClick={() => navigate(-1)}>목록으로</Button>
      </HStack>
    </Box>
  );
};

export default AdminReviewDetail;
