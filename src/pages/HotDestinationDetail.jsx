// src/pages/HotDestinationDetail.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Image, Text, Heading, Badge, VStack, HStack,
  Textarea, Button, Divider, useToast, Icon, Flex
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";
import axios from "axios";

function HotDestinationDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [place, setPlace] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [editingId, setEditingId] = useState("");
  const [editedText, setEditedText] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const currentUser = { id: 1, name: "guest" }; // 임시 유저 ID

  // 여행지 정보는 목업이거나 백엔드 연결 시 여기서 가져오도록
  useEffect(() => {
    // 예시: 백엔드에서 place 정보도 가져올 수 있다면 여기에 추가
    fetchReviews();
    fetchPlace();
  }, [id]);

  const fetchPlace = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/trip/hot-place/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("place", res.data.data);
      setPlace(res.data.data);
      console.log("place >> ", res.data.data.image);
    } catch (err) {
      toast({ title: "여행지 불러오기 실패", status: "error" });
    }
  };
  

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/review/place/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      setReviews(list);
      console.log(list);
    } catch (err) {
      toast({ title: "리뷰 불러오기 실패", status: "error" });
    }
  };

  const createReview = async () => {
    if (!reviewText || rating === 0) {
      toast({ title: "별점과 후기를 입력해주세요.", status: "warning" });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/review", {
        destination_id: Number(id),
        rating,
        content: reviewText
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast({ title: "리뷰 등록 완료", status: "success" });
      setReviewText("");
      setRating(0);
      fetchReviews();
    } catch (err) {
      toast({ title: "등록 실패", description: err.response?.data?.message || "오류 발생", status: "error" });
    }
  };

  const updateReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3000/review/${reviewId}`, {
        rating: editedRating,
        content: editedText
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast({ title: "리뷰 수정 완료", status: "success" });
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      toast({ title: "수정 실패", status: "error" });
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/review/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "리뷰 삭제 완료", status: "success" });
      fetchReviews();
    } catch (err) {
      toast({ title: "삭제 실패", status: "error" });
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditedText(review.content);
    setEditedRating(review.rating);
  };

  return (
    <Box px={10} py={8}>
      <Flex gap={10} maxW="1000px" mx="auto" align="start">
        <Box bg="white" borderRadius="lg" boxShadow="md" w="300px">
          <Box p={4}>
            <Text fontSize="xs" color="purple.600" fontWeight="bold">TOP 1 {place.name}</Text>
            <Image src={`${place.image}`} alt="여행지 이미지" />
            <Text fontSize="l">{place.description}</Text>
          </Box>
        </Box>

        <Box flex={1}>
          <Heading size="sm" mb={2}>리뷰 작성 <Text as="span" color="gray.500">({Array.isArray(reviews) ? reviews.length : 0})</Text></Heading>

          <Box bg="blue.50" p={4} borderRadius="md" mb={6}>
            <HStack spacing={1} mb={2}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  as={StarIcon}
                  color={star <= rating ? "yellow.400" : "gray.300"}
                  boxSize={5}
                  cursor="pointer"
                  onClick={() => setRating(star)}
                />
              ))}
            </HStack>
            <Textarea
              placeholder="후기를 입력하세요."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              mb={2}
            />
            <Button onClick={createReview} colorScheme="blue">등록</Button>
          </Box>

          <VStack align="stretch" spacing={4}>
            {Array.isArray(reviews) && reviews.map((rev) => ( console.log(rev),
              <Box key={rev.id} p={3} borderWidth="1px" borderRadius="md">
                <HStack spacing={1}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon
                      key={i}
                      color={i <= (editingId === rev.id ? editedRating : rev.rating) ? "yellow.400" : "gray.300"}
                      fontSize="sm"
                      cursor={editingId === rev.id ? "pointer" : "default"}
                      onClick={() => editingId === rev.id && setEditedRating(i)}
                    />
                  ))}
                </HStack>
                {editingId === rev.id ? (
                  <>
                    <Textarea
                      size="sm"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      mt={1}
                    />
                    <HStack mt={1}>
                      <Button size="xs" colorScheme="blue" onClick={() => updateReview(rev.id)}>저장</Button>
                      <Button size="xs" onClick={() => setEditingId(null)}>취소</Button>
                    </HStack>
                  </>
                ) : (
                  <>
                    <Text mt={1}>{rev.review_content}</Text>
                    <HStack mt={1}>
                      <Text fontSize="xs" color="gray.500">{rev.user_name || "작성자"}</Text>
                      {rev.user_id === currentUser.id && (
                        <>
                          <Button size="xs" onClick={() => handleEdit(rev)}>수정</Button>
                          <Button size="xs" colorScheme="red" onClick={() => deleteReview(rev.id)}>삭제</Button>
                        </>
                      )}
                    </HStack>
                  </>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}

export default HotDestinationDetail;