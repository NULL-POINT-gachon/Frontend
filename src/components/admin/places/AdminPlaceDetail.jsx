// src/components/admin/places/AdminPlaceDetail.jsx
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

const AdminPlaceDetail = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchPlaceDetail = async () => {
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

        const response = await axios.get(`http://localhost:3000/admin/destinations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setPlace(response.data.data);
        }
      } catch (error) {
        console.error("여행지 상세 정보 가져오기 오류:", error);
        setError(true);
        
        if (error.response) {
          if (error.response.status === 401) {
            toast({
              title: "인증 오류",
              description: "로그인이 만료되었습니다. 다시 로그인해주세요.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            localStorage.removeItem('token');
            navigate('/login');
          } else if (error.response.status === 403) {
            toast({
              title: "권한 없음",
              description: "관리자 권한이 필요합니다.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            navigate('/');
          } else if (error.response.status === 404) {
            toast({
              title: "여행지를 찾을 수 없음",
              description: "요청하신 여행지가 존재하지 않습니다.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            navigate('/admin/places');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetail();
  }, [id, navigate, toast]);

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
        <Text color="red.500" fontWeight="bold">여행지 정보를 불러올 수 없습니다</Text>
        <Button mt={4} onClick={() => navigate('/admin/places')}>
          목록으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between">
          <Heading size="lg">{place.destination_name}</Heading>
          <Badge colorScheme="blue" fontSize="md" p={2}>
            {place.category}
          </Badge>
        </HStack>

        <Box>
          <Heading size="md" mb={2}>기본 정보</Heading>
          <VStack align="stretch" spacing={2}>
            <Text><strong>주소:</strong> {place.address}</Text>
            <Text><strong>설명:</strong> {place.description}</Text>
            <Text><strong>등록일:</strong> {new Date(place.created_at).toLocaleDateString()}</Text>
            <Text><strong>수정일:</strong> {new Date(place.updated_at).toLocaleDateString()}</Text>
          </VStack>
        </Box>

        <Box>
          <Heading size="md" mb={2}>추가 정보</Heading>
          <VStack align="stretch" spacing={2}>
            <Text><strong>위도:</strong> {place.latitude}</Text>
            <Text><strong>경도:</strong> {place.longitude}</Text>
            <Text><strong>전화번호:</strong> {place.phone_number || '없음'}</Text>
            <Text><strong>운영시간:</strong> {place.operating_hours || '없음'}</Text>
          </VStack>
        </Box>

        <HStack spacing={4}>
          <Button colorScheme="blue" onClick={() => navigate(`/admin/places/${id}/edit`)}>
            수정하기
          </Button>
          <Button onClick={() => navigate('/admin/places')}>
            목록으로 돌아가기
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default AdminPlaceDetail;
