import React from "react";
import {
  Box,
  VStack,
  Text,
  Tag,
  HStack,
  Image,
  Divider,
  Icon,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";
import { FaClock, FaRoute, FaMapMarkerAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const FinalRecommendationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const plan = location.state?.plan;
  const items = plan?.days?.[0]?.items || [];

  // 임시 이동 데이터 (향후 API or 거리 계산 로직으로 대체)
  const fakeTravelData = [
    { duration: "15분", distance: "2.4km" },
    { duration: "10분", distance: "1.8km" },
    { duration: "12분", distance: "2.1km" },
  ];

  return (
    <Box bg="white" minH="100vh">
      <Header />

      <Box bgGradient="linear(to-b, blue.100, white)" py={10} textAlign="center">
        <Text fontSize="3xl" fontWeight="bold">
          <Icon as={FaMapMarkerAlt} color="pink.400" mr={2} />
          최적 동선 보기
        </Text>
      </Box>

      <Box p={8} maxW="1400px" mx="auto">
        {items.length < 2 ? (
          <Box
            bg="gray.100"
            p={8}
            borderRadius="lg"
            textAlign="center"
            boxShadow="md"
          >
            <Text fontSize="lg" color="gray.600">
              ⚠️ 장소 수가 부족하여 경로를 생성할 수 없습니다.
            </Text>
          </Box>
        ) : (
          <>
            <Flex gap={10} align="start" flexWrap="wrap">
              {/* 지도 영역 (향후 MapView 컴포넌트로 교체 예정) */}
              <Box flex="1" bg="gray.100" p={6}>
                <Box bg="white" p={6} borderRadius="md" boxShadow="md">
                  <Text fontSize="lg" fontWeight="semibold">📍 추후 지도 연동 예정</Text>
                  <Text color="gray.600">Google Maps 또는 Kakao Maps 연동 가능합니다.</Text>
                </Box>
              </Box>

              {/* 장소 카드 리스트 */}
              <Box flex="1.2">
                <VStack spacing={6} align="stretch">
                  {items.map((item, idx) => (
                    <Box key={idx} bg="white" p={4} borderRadius="lg" boxShadow="md">
                      <HStack spacing={4}>
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            boxSize="100px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                        )}
                        <Box flex="1">
                          <Text fontSize="lg" fontWeight="bold">
                            {idx + 1}번째 방문: {item.title}
                          </Text>
                          <Text color="gray.600">⏰ 시간: {item.time}</Text>
                          <HStack mt={2} wrap="wrap">
                            {item.tags?.map((tag, i) => (
                              <Tag key={i} colorScheme="teal">{tag}</Tag>
                            ))}
                          </HStack>
                        </Box>
                      </HStack>

                      {/* 이동 정보 */}
                      {idx < items.length - 1 && (
                        <Box mt={4} pl={4} borderLeft="4px solid #3182ce">
                          <HStack spacing={4}>
                            <Icon as={FaClock} color="blue.500" />
                            <Text fontSize="sm" color="gray.600">
                              예상 이동 시간: {fakeTravelData[idx]?.duration}
                            </Text>
                            <Icon as={FaRoute} color="green.500" />
                            <Text fontSize="sm" color="gray.600">
                              이동 거리: {fakeTravelData[idx]?.distance}
                            </Text>
                          </HStack>
                        </Box>
                      )}
                    </Box>
                  ))}
                </VStack>
              </Box>
            </Flex>

            {/* 하단 설명 및 버튼 */}
            <Divider my={8} />
            <Box textAlign="center">
              <Text fontSize="md" color="gray.500" mb={6}>
                위 일정은 추천된 순서에 따라 최적화되어 있습니다.
              </Text>
              <HStack spacing={4} justify="center">
                <Button variant="outline" colorScheme="blue" onClick={() => navigate("/plan")}>
                  ← 일정 수정하러 가기
                </Button>
                <Button
                  colorScheme="green"
                  onClick={() => {
                    // 추후 백엔드 연동 예정
                    // await axios.post("/api/confirm-plan", plan);
                    toast({
                      title: "일정이 확정되었습니다!",
                      status: "success",
                      duration: 2000,
                      isClosable: true,
                    });
                  }}
                >
                  ✅ 일정 확정하기
                </Button>
              </HStack>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default FinalRecommendationPage;
