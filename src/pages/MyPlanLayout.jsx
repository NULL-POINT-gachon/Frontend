import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
  Box, HStack, VStack, Heading, Button, Text,
} from "@chakra-ui/react";
import Header from "../components/Header";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { DeleteIcon } from "@chakra-ui/icons";   // ↰ 추가
import { IconButton, ButtonGroup } from "@chakra-ui/react";

export default function MyPlanLayout() {
  const navigate = useNavigate();
  const { tripId } = useParams();         // 선택된 일정 ID(없을 수도 있음)
  const [trips, setTrips] = useState([]);
  const { token } = useAuth();

  /* 일정 목록 로딩 */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/trip/all",
            { headers: { Authorization: `Bearer ${token}` } },
          { params: { page: 1, limit: 100 } });
        if (data.result_code === 200) setTrips(data.trips);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const goPlan = (id) => navigate(`/my-plan/${id}`);

  return (
    <>
      <Header />
      <Box bgGradient="linear(to-b, blue.200, white)" py={10} />
      <Box bg="gray.50" minH="100vh" p={6}>
        <HStack align="start" spacing={6}>
          {/* ---- 사이드바 ---- */}
          <Box w="260px" bg="blue.100" p={4} borderRadius="md" boxShadow="md">
            <Heading size="md" mb={4}>일정 관리</Heading>
            {trips.length === 0 ? (
              <Text fontSize="sm">일정이 없습니다.</Text>
            ) : (
              <VStack align="stretch" spacing={2}>
                {trips.map(t => (
                  <ButtonGroup key={t.식별자} isAttached w="full">
                    {/* 일정 상세 보기 버튼 */}
                    <Button
                      flex="1"
                      justifyContent="flex-start"
                      colorScheme={String(t.식별자) === tripId ? "teal" : "blue"}
                      onClick={() => goPlan(t.식별자)}
                    >
                      {t.여행일정명}
                    </Button>
                                
                    {/* 삭제 아이콘 버튼 */}
                    <IconButton
                      aria-label="일정 삭제"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="outline"
                      onClick={async (e) => {
                        e.stopPropagation();                    // 부모 버튼 클릭 방지
                        const ok = window.confirm("정말 삭제하시겠습니까?");
                        if (!ok) return;
                      
                        try {
                          await axios.delete(
                            `http://localhost:3000/trip/${t.식별자}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          // ↘️ trips 상태에서 제거
                          setTrips(prev => prev.filter(p => p.식별자 !== t.식별자));
                        } catch (err) {
                          console.error(err);
                          alert("삭제에 실패했습니다.");
                        }
                      }}
                    />
                  </ButtonGroup>
                ))}
              </VStack>
            )}
          </Box>

          {/* ---- 오른쪽 영역(Outlet) ---- */}
          <Box flex="1">
            <Outlet />   {/* BlankPanel 또는 PlanDetailPanel 렌더링 */}
          </Box>
        </HStack>
      </Box>
    </>
  );
}
