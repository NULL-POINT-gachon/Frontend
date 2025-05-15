// src/components/admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, SimpleGrid, Card, CardHeader, CardBody, Heading, Text,
  Badge, VStack, HStack, Spinner, useToast
} from "@chakra-ui/react";
import {
  UserIcon, MapPinIcon, MessageSquareIcon, CalendarIcon,
  BarChart3Icon, PieChartIcon, BellIcon, MessageSquareIcon as QIcon
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer, XAxis, YAxis, Legend
} from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = ["#3182CE", "#38B2AC", "#DD6B20", "#805AD5"];

export default function AdminHome () {
  /* ────────── state ────────── */
  const [loading, setLoading]   = useState(true);
  const [cards,   setCards]     = useState({});   // users / places / reviews / schedules
  const [pieData, setPieData]   = useState([]);   // ‘무드’ 통계
  const [notices, setNotices]   = useState([]);   // 최신 공지
  const [qna,     setQna]       = useState([]);   // 최신 QnA

  const toast    = useToast();
  const navigate = useNavigate();

  /* ────────── fetch once ────────── */
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");          // AdminAuthProvider 가 저장
        if (!token) throw new Error("no admin token");

        const { data } = await axios.get(
          "http://localhost:3000/admin/summary",
          { headers:{ Authorization:`Bearer ${token}` } }
        );

        /**  expected :
         *  data = {
         *    result_code: 200,
         *    data : {
         *      cards         : { users:##, places:##, reviews:##, schedules:## },
         *      pieMood       : [ { name:'힐링', value:40 }, … ],
         *      latestNotices : [ { id, title, created_at }, … ],
         *      latestQna     : [ { id, question, created_at, answered }, … ]
         *    }
         *  }
         */
        if (data.result_code !== 200) throw new Error("bad result_code");

        const { cards, pieMood, latestNotices, latestQna } = data.data;
        setCards(cards ?? {});
        setPieData(pieMood ?? []);
        setNotices(latestNotices ?? []);
        setQna(latestQna ?? []);

      } catch (err) {
        console.error(err);
        toast({ title:"대시보드 로드 실패", status:"error" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  if (loading) return <Spinner size="lg" mt={10} ml={10} />;

  /* ────────── derived data ────────── */
  const cardMeta = [
    { key:"users"    , icon:<UserIcon size={18}/>,          label:"총 회원 수" },
    { key:"places"   , icon:<MapPinIcon size={18}/>,        label:"여행지 수" },
    { key:"reviews"  , icon:<MessageSquareIcon size={18}/>, label:"리뷰 수"   },
    { key:"schedules", icon:<CalendarIcon size={18}/>,      label:"일정 수"   }
  ];

  /* 바 차트용 */
  const barData = cardMeta.map(m => ({
    name : m.label.replace(" 총",""),
    count: cards[m.key] ?? 0
  }));

  /* 증가량은 아직 API 없음 → 0 으로 */
  const incData = cardMeta.map(m => ({
    name  : m.label.replace(" 총",""),
    amount: 0
  }));

  /* ────────── render ────────── */
  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>관리자 대시보드</Heading>

      {/* ■ 카드 4개 */}
      <SimpleGrid columns={{ base:1, md:2, lg:4 }} spacing={4} mb={8}>
        {cardMeta.map(meta => (
          <Card key={meta.key} shadow="sm">
            <CardHeader display="flex" alignItems="center" gap={2}>
              {meta.icon}
              <Text fontWeight="bold">{meta.label}</Text>
            </CardHeader>
            <CardBody>
              <Heading size="md">{cards[meta.key] ?? 0}</Heading>
              <Text fontSize="sm" color="gray.500">이번 달 기준</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* ■ 증가량 · 공지 · QnA */}
      <SimpleGrid columns={{ base:1, md:2, lg:3 }} spacing={6} mb={8}>
        {/* ── 증가량 카드 */}
        <Card>
          <CardHeader><Heading size="sm">이번 달 증가량</Heading></CardHeader>
          <CardBody>
            <VStack align="start" spacing={3}>
              {incData.map(i => (
                <HStack key={i.name} w="100%" justify="space-between">
                  <Text>{i.name}</Text>
                  <Badge colorScheme="green">+{i.amount}</Badge>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* ── 공지사항 카드 */}
        <Card>
          <CardHeader display="flex" justifyContent="space-between" alignItems="center">
            <HStack cursor="pointer" onClick={() => navigate("/admin/notices")}>
              <BellIcon size={18}/><Heading size="sm">공지사항</Heading>
            </HStack>
            <Text fontSize="xs" color="gray.400">(더보기)</Text>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={3}>
              {notices.slice(0,5).map(n => (
                <Box key={n.id} p={2} cursor="pointer"
                     _hover={{ bg:"gray.50" }}
                     onClick={() => navigate(`/admin/notices/${n.id}`)}>
                  <Text fontSize="sm" fontWeight="medium">{n.title}</Text>
                  <Text fontSize="xs" color="gray.500">{n.created_at?.slice(0,10)}</Text>
                </Box>
              ))}
              {notices.length === 0 && <Text fontSize="sm" color="gray.400">공지 없음</Text>}
            </VStack>
          </CardBody>
        </Card>

        {/* ── QnA 카드 */}
        <Card>
          <CardHeader display="flex" justifyContent="space-between" alignItems="center">
            <HStack cursor="pointer" onClick={() => navigate("/admin/qna")}>
              <QIcon size={18}/><Heading size="sm">Q&A 문의</Heading>
            </HStack>
            <Text fontSize="xs" color="gray.400">(전체 보기)</Text>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={3}>
              <HStack fontSize="sm">
                <Text>총 문의:</Text>
                <Text fontWeight="bold">{qna.length}</Text>
                <Text ml={4}>미답변:</Text>
                <Text fontWeight="bold" color="red.500">
                  {qna.filter(q => !q.answered).length}
                </Text>
              </HStack>

              {qna.filter(q => !q.answered).slice(0,1).map(q => (
                <Box key={q.id} p={2} cursor="pointer"
                     _hover={{ bg:"gray.50" }}
                     onClick={() => navigate(`/admin/qna/${q.id}`)}>
                  <Text fontSize="sm" fontWeight="medium">{q.question}</Text>
                  <Text fontSize="xs" color="gray.500">{q.created_at?.slice(0,10)}</Text>
                </Box>
              ))}
              {qna.filter(q => !q.answered).length === 0 &&
               <Text fontSize="sm" color="gray.400">미답변 문의 없음</Text>}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* ■ 차트 */}
      <SimpleGrid columns={{ base:1, md:2 }} spacing={6}>
        {/* Bar 차트 */}
        <Card>
          <CardHeader>
            <HStack><BarChart3Icon size={18}/><Heading size="sm">데이터 요약</Heading></HStack>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <XAxis dataKey="name"/><YAxis/><Tooltip/><Legend/>
                  <Bar dataKey="count" fill="#3182CE"/>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        {/* Pie 차트 */}
        <Card>
          <CardHeader>
            <HStack><PieChartIcon size={18}/><Heading size="sm">선호 여행 무드</Heading></HStack>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((_,idx)=><Cell key={idx} fill={COLORS[idx % COLORS.length]}/> )}
                  </Pie>
                  <Tooltip/>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
