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
// import { getReviewById, deleteReview, approveReview } from "../../api/reviewAPI"; // 실제 연동 시 사용

const dummyReviews = [
  {
    id: 1,
    author: "김가천",
    place: "제주도",
    content: "정말 아름다운 풍경이 인상적이었어요!",
    rating: 4,
    reported: true,
    reason: "부적절한 언어",
    createdAt: "2025-04-01",
  },
  {
    id: 2,
    author: "이가천",
    place: "경복궁",
    content: "역사의 숨결을 느낄 수 있었습니다.",
    rating: 5,
    reported: false,
    createdAt: "2025-04-02",
  },
];

const AdminReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // 더미 데이터로 조회
    const found = dummyReviews.find((r) => r.id === parseInt(id));
    setTimeout(() => {
      setReview(found || null);
      setLoading(false);
    }, 300);

    // 실제 API 연동 시 아래 코드 사용
    /*
    const fetchReview = async () => {
      try {
        const res = await getReviewById(id);
        setReview(res.data);
      } catch {
        toast({ title: "리뷰 불러오기 실패", status: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
    */
  }, [id]);

  const handleApprove = () => {
    // 실제 사용 시: await approveReview(id);
    toast({ title: "리뷰 승인 완료", status: "success" });
    navigate("/admin/reviews");
  };

  const handleDelete = () => {
    // 실제 사용 시: await deleteReview(id);
    toast({ title: "리뷰 삭제 완료", status: "success" });
    navigate("/admin/reviews");
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
        <Text><strong>작성자:</strong> {review.author}</Text>
        <Text><strong>장소:</strong> {review.place}</Text>
        <Text><strong>작성일:</strong> {review.createdAt}</Text>
        <Text><strong>내용:</strong> {review.content}</Text>
        <Text><strong>평점:</strong> {"⭐".repeat(review.rating)} ({review.rating})</Text>
        {review.reported && (
          <Box>
            <Badge colorScheme="red" mr={2}>신고됨</Badge>
            <Text><strong>신고 사유:</strong> {review.reason}</Text>
          </Box>
        )}
      </VStack>

      <HStack spacing={4} mt={6}>
        <Button colorScheme="blue" onClick={handleApprove}>승인</Button>
        <Button colorScheme="red" onClick={handleDelete}>삭제</Button>
      </HStack>
    </Box>
  );
};

export default AdminReviewDetail;
