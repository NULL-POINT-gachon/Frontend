import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, SimpleGrid, Card, CardHeader, CardBody, Heading, Text,
  Badge, VStack, HStack, Flex
} from "@chakra-ui/react";
import {
  UserIcon, MapPinIcon, MessageSquareIcon, CalendarIcon,
  BarChart3Icon, PieChartIcon, BellIcon
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer, XAxis, YAxis, Legend
} from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = ["#3182CE", "#38B2AC", "#DD6B20", "#805AD5"];

const AdminHome = () => {
  const navigate = useNavigate();

  // 상태 정의
  const [stats, setStats] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [increaseData, setIncreaseData] = useState([]);
  const [notices, setNotices] = useState([]);
  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 데이터 로딩
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: 실제 백엔드 API가 생기면 여기에 연결
        // const res = await axios.get("/api/admin/dashboard");

        // 임시 더미 데이터
        setStats([
          { icon: <UserIcon size={18} />, label: "총 회원 수", value: 120 },
          { icon: <MapPinIcon size={18} />, label: "여행지 수", value: 32 },
          { icon: <MessageSquareIcon size={18} />, label: "리뷰 수", value: 87 },
          { icon: <CalendarIcon size={18} />, label: "일정 수", value: 45 },
        ]);

        setBarData([
          { name: "회원", count: 120 },
          { name: "여행지", count: 32 },
          { name: "리뷰", count: 87 },
          { name: "일정", count: 45 },
        ]);

        setPieData([
          { name: "힐링", value: 40 },
          { name: "먹방", value: 25 },
          { name: "액티비티", value: 20 },
          { name: "기타", value: 15 },
        ]);

        setIncreaseData([
          { name: "회원", amount: 12 },
          { name: "여행지", amount: 5 },
          { name: "리뷰", amount: 18 },
          { name: "일정", amount: 7 },
        ]);

        setNotices([
          { id: 1, title: "[점검] 4월 5일 서버 점검 예정", date: "2025-03-29" },
          { id: 2, title: "새로운 테마 여행지 추가", date: "2025-03-27" },
        ]);

        setQnaList([
          { id: 1, question: "비밀번호를 잊어버렸어요.", date: "2025-03-25", answered: true },
          { id: 2, question: "여행 일정은 몇 개까지 등록 가능한가요?", date: "2025-03-26", answered: false },
        ]);
      } catch (err) {
        console.error("대시보드 데이터 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 로딩 처리
  if (loading) {
    return <Text textAlign="center">대시보드 데이터를 불러오는 중입니다...</Text>;
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>관리자 대시보드</Heading>

      {/* 통계 카드 */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
        {stats.map((item, idx) => (
          <Card key={idx} boxShadow="sm">
            <CardHeader display="flex" alignItems="center" gap={2}>
              {item.icon}
              <Text fontWeight="bold">{item.label}</Text>
            </CardHeader>
            <CardBody>
              <Heading size="md">{item.value}</Heading>
              <Text fontSize="sm" color="gray.500">이번 달 기준</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* 증감, 공지, QnA 카드 */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
        {/* 이번 달 증가량 */}
        <Card>
          <CardHeader><Heading size="sm">이번 달 증가량</Heading></CardHeader>
          <CardBody>
            <VStack align="start" spacing={3}>
              {increaseData.map((item, idx) => (
                <HStack key={idx} justify="space-between" w="100%">
                  <Text>{item.name}</Text>
                  <Badge colorScheme="green">+{item.amount}</Badge>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* 공지사항 */}
        <Card>
          <CardHeader display="flex" justifyContent="space-between" alignItems="center">
            <HStack
              cursor="pointer"
              onClick={() => navigate("/admin/notices")}
              _hover={{ textDecoration: "underline", color: "teal.600" }}
            >
              <BellIcon size={18} />
              <Heading size="sm">공지사항</Heading>
            </HStack>
            <Text fontSize="xs" color="gray.400">(더보기)</Text>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={3}>
              {notices.map((notice) => (
                <Box
                  key={notice.id}
                  cursor="pointer"
                  onClick={() => navigate(`/admin/notices/${notice.id}`)}
                  _hover={{ bg: "gray.50" }}
                  p={2}
                  borderRadius="md"
                >
                  <Text fontSize="sm" fontWeight="medium">{notice.title}</Text>
                  <Text fontSize="xs" color="gray.500">{notice.date}</Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* QnA */}
        <Card>
          <CardHeader>
            <Heading size="sm">Q&A 문의</Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="sm" mb={2}>총 문의: {qnaList.length}건</Text>
            <Text fontSize="sm" color="red.500">
              미답변: {qnaList.filter((q) => !q.answered).length}건
            </Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* 하단 차트 */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card>
          <CardHeader><BarChart3Icon size={18} /><Heading size="sm" ml={2}>데이터 요약</Heading></CardHeader>
          <CardBody>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3182CE" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><PieChartIcon size={18} /><Heading size="sm" ml={2}>선호 여행 무드</Heading></CardHeader>
          <CardBody>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default AdminHome;
