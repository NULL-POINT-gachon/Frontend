import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EditPlaceModal from "./EditPlaceModal"; // 모달 import

const AdminPlaceDetail = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); // 모달 상태
  const toast = useToast();
  const navigate = useNavigate();

  const fetchPlaceDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/admin/destinations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPlace(response.data.data);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaceDetail();
  }, [id]);

  const handleModalSave = () => {
    fetchPlaceDetail(); // 수정 후 상세 정보 갱신
    setIsEditOpen(false);
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error || !place) {
    return (
      <Box p={6}>
        <Text color="red.500">여행지 정보를 불러올 수 없습니다.</Text>
        <Button onClick={() => navigate("/admin/places")}>목록으로 돌아가기</Button>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between">
          <Heading size="lg">{place.destination_name}</Heading>
          <Badge colorScheme="blue">{place.category}</Badge>
        </HStack>

        <Box>
          <Heading size="md">기본 정보</Heading>
          <Text><strong>주소:</strong> {place.address || "없음"}</Text>
          <Text><strong>설명:</strong> {place.description}</Text>
          <Text><strong>등록일:</strong> {new Date(place.created_at).toLocaleDateString()}</Text>
          <Text><strong>수정일:</strong> {new Date(place.updated_at).toLocaleDateString()}</Text>
        </Box>

        <Box>
          <Heading size="md">추가 정보</Heading>
          <Text><strong>위도:</strong> {place.latitude}</Text>
          <Text><strong>경도:</strong> {place.longitude}</Text>
          <Text><strong>전화번호:</strong> {place.phone_number || "없음"}</Text>
          <Text><strong>운영시간:</strong> {place.operating_hours || "없음"}</Text>
        </Box>

        <HStack spacing={4}>
          <Button colorScheme="blue" onClick={() => setIsEditOpen(true)}>
            수정하기
          </Button>
          <Button onClick={() => navigate("/admin/places")}>목록으로 돌아가기</Button>
        </HStack>
      </VStack>

      {/* ✅ 수정 모달 연결 */}
      <EditPlaceModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        place={place}
        onSave={handleModalSave}
      />
    </Box>
  );
};

export default AdminPlaceDetail;