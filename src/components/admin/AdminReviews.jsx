import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Select,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [sortOption, setSortOption] = useState("기본");
  const navigate = useNavigate();
  const toast = useToast();

  const fetchReviews = async () => {
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

      const response = await axios.get('http://localhost:3000/admin/reviews', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("리뷰 목록 가져오기 오류:", error);
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
        }
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = reviews
    .filter((r) => {
      const matchKeyword =
        r.user_name?.includes(search) || r.destination_name?.includes(search);
      const matchStatus =
        statusFilter === "전체" ||
        (statusFilter === "비활성화" && r.status === 0) ||
        (statusFilter === "활성화" && r.status === 1);
      return matchKeyword && matchStatus;
    })
    .sort((a, b) => {
      if (sortOption === "평점높은순") return b.rating - a.rating;
      if (sortOption === "평점낮은순") return a.rating - b.rating;
      return 0;
    });

  return (
    <Box p={6}>
      <Heading size="md" mb={4}>
        리뷰 관리
      </Heading>

      <Box display="flex" gap={4} mb={4} flexWrap="wrap">
        <Input
          placeholder="작성자 또는 장소 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="250px"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          maxW="150px"
        >
          <option value="전체">전체</option>
          <option value="비활성화">비활성화</option>
          <option value="활성화">활성화</option>
        </Select>
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          maxW="160px"
        >
          <option value="기본">기본 정렬</option>
          <option value="평점높은순">평점 높은 순</option>
          <option value="평점낮은순">평점 낮은 순</option>
        </Select>
      </Box>

      {error ? (
        <Text color="red.500" fontWeight="bold">
          리뷰를 불러오지 못했습니다
        </Text>
      ) : filtered.length === 0 ? (
        <Text color="gray.500" textAlign="center" py={4}>
          {search || statusFilter !== "전체" ? "검색 조건에 맞는 리뷰가 없습니다" : "등록된 리뷰가 없습니다"}
        </Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th textAlign="left" minW="100px">작성자</Th>
                <Th textAlign="left" minW="120px">장소</Th>
                <Th textAlign="left" minW="300px">내용</Th>
                <Th textAlign="left" minW="100px">평점</Th>
                <Th textAlign="left" minW="100px">상태</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((r) => (
                <Tr
                  key={r.id}
                  onClick={() => navigate(`/admin/reviews/${r.id}`)}
                  _hover={{ bg: "gray.50", cursor: "pointer" }}
                >
                  <Td>{r.user_name}</Td>
                  <Td>{r.destination_name}</Td>
                  <Td>{r.review_content}</Td>
                  <Td>{"⭐".repeat(r.rating)}</Td>
                  <Td>
                    {r.status === 1 ? (
                      <Badge colorScheme="green">활성화</Badge>
                    ) : (
                      <Badge colorScheme="red">비활성화</Badge>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default AdminReviews;
