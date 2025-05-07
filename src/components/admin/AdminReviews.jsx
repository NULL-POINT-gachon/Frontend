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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
// import { getAllReviews } from "../../api/reviewAPI"; // 나중에 활성화

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [reportFilter, setReportFilter] = useState("전체");
  const [sortOption, setSortOption] = useState("기본");

  const navigate = useNavigate();

  useEffect(() => {
    // 더미 데이터 기반 화면 표시용
    const dummyData = [
      {
        id: 1,
        author: "김가천",
        place: "제주도",
        content: "정말 아름다운 풍경이 인상적이었어요!",
        rating: 5,
        reported: false,
      },
      {
        id: 2,
        author: "이가천",
        place: "경복궁",
        content: "역사의 숨결을 느낄 수 있었습니다.",
        rating: 4,
        reported: true,
      },
    ];
    setReviews(dummyData);

    // 나중에 실제 API 연동 시 사용
    /*
    const fetchData = async () => {
      try {
        const res = await getAllReviews();
        setReviews(res.data);
      } catch {
        setError(true);
      }
    };
    fetchData();
    */
  }, []);

  const filtered = reviews
    .filter((r) => {
      const matchKeyword =
        r.author.includes(search) || r.place.includes(search);
      const matchReport =
        reportFilter === "전체" ||
        (reportFilter === "신고됨" && r.reported) ||
        (reportFilter === "정상" && !r.reported);
      return matchKeyword && matchReport;
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
          value={reportFilter}
          onChange={(e) => setReportFilter(e.target.value)}
          maxW="150px"
        >
          <option value="전체">전체</option>
          <option value="신고됨">신고된 리뷰</option>
          <option value="정상">정상 리뷰</option>
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
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th textAlign="left" minW="100px">작성자</Th>
                <Th textAlign="left" minW="120px">장소</Th>
                <Th textAlign="left" minW="300px">내용</Th>
                <Th textAlign="left" minW="100px">평점</Th>
                <Th textAlign="left" minW="100px">신고 여부</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((r) => (
                <Tr
                  key={r.id}
                  onClick={() => navigate(`/admin/reviews/${r.id}`)}
                  _hover={{ bg: "gray.50", cursor: "pointer" }}
                >
                  <Td>{r.author}</Td>
                  <Td>{r.place}</Td>
                  <Td>{r.content}</Td>
                  <Td>{"⭐".repeat(r.rating)}</Td>
                  <Td>
                    {r.reported ? (
                      <Badge colorScheme="red">신고됨</Badge>
                    ) : (
                      <Badge colorScheme="green">정상</Badge>
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
