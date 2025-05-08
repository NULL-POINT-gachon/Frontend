import React, { useEffect, useState } from "react";
import {
  Box, Flex, VStack, Text, Input, Button, Tag, HStack,
  useToast, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, useDisclosure, Select, IconButton,
  SimpleGrid, Tabs, Tab, TabList, TabPanels, TabPanel, ModalFooter,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import MapPreview from "../components/MapPreview";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from "../contexts/AuthContext";
import { CheckIcon } from "@chakra-ui/icons";
import Header from "../components/Header";
import axios from "axios";
import { useTravel } from "../contexts/TravelContext";


const PlanRecommendationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [plan, setPlan] = useState({ days: [] });
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [selectedTransport, setSelectedTransport] = useState("도보");
  const { token } = useAuth();
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const [newTitle, setNewTitle] = useState("");
  const { travelData } = useTravel();
  const tripId = travelData.tripId;
  console.log("tripId", tripId);

  useEffect(() => {
    // 👉 추천 장소
    const initial = location.state?.recommended || [];   // [] fallback
    setRecommendedPlaces(initial);
  
    // 👉 기존 플랜 or 3일 기본 플랜
    setPlan(location.state?.plan ?? {
      days: [ { day:1, items:[] }, { day:2, items:[] }, { day:3, items:[] } ],
    });
  }, [location]);

  useEffect(() => {
    const fetchPlaces = async () => {
      setRecommendedPlaces(dummyPlaces);
    };

    if (location.state?.plan) {
      setPlan(location.state.plan);
    } else {
      setPlan({
        days: [ { day: 1, items: [] }, { day: 2, items: [] }, { day: 3, items: [] } ]
      });
    }

    fetchPlaces();
  }, [location]);

  useEffect(() => {
    // 👉 추천 장소
    const initial = location.state?.recommended || [];   // [] fallback
    setRecommendedPlaces(initial);
  
    // 👉 기존 플랜 or 3일 기본 플랜
    setPlan(location.state?.plan ?? {
      days: [ { day:1, items:[] }, { day:2, items:[] }, { day:3, items:[] } ],
    });
  }, [location]);
  
  const handleAddSelectedPlace = () => {
    if (!selectedPlace) return;
  
    const newItem = {
      title:  selectedPlace.title,
      time:   selectedTime,
      tags:   [...selectedPlace.tags, selectedTransport],
      image:  selectedPlace.image,
    };
  
    /* 🔹 플랜에 추가 */
    const newPlan = { ...plan };
    newPlan.days[selectedDayIndex].items.push(newItem);
    setPlan(newPlan);
  
    /* 🔹 추천 목록에서 빼기 */
    setRecommendedPlaces(prev => prev.filter(p => p.title !== selectedPlace.title));
  
    /* UI 초기화 */
    onClose();
    setSelectedPlace(null);
    setSelectedTime("12:00");
    setSelectedTransport("도보");
  };

  const optimizeRoute = async () => {
    try {
      const tripId = location.state.tripId;
      const { data } = await axios.post(
        `http://localhost:3000/trip/${tripId}/route`,
        { ...plan, transportMode: "DRIVING" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlan({ days: data.days });
      toast({ title: "최적 경로 계산 완료!", status: "success" });
    } catch (err) {
      toast({ title: "최적 동선 분석 실패", status: "error" });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(plan.days[selectedDayIndex].items);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    const newPlan = { ...plan };
    newPlan.days[selectedDayIndex].items = items;
    setPlan(newPlan);
  };

  return (
    <Box bg="white" minH="100vh">
      <Header />
      <Box bgGradient="linear(to-b, blue.100, white)" py={10} textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">🛠️ 일정 수정</Text>
      </Box>

      <Flex>
        <Box flex="0 0 45%" minW="420px" maxW="560px" p={6} bg="gray.50">
          <Tabs variant="enclosed" index={selectedDayIndex} onChange={(i) => setSelectedDayIndex(i)}>
            <TabList mb={4}>
              {plan.days.map((d, i) => (
                <Tab key={i}>{d.day}일차</Tab>
              ))}
            </TabList>
            <TabPanels>
              {plan.days.map((day, i) => (
                <TabPanel key={i} p={0}>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId={`day-${i}`} ignoreContainerClipping={false}>
                      {(provided) => (
                        <VStack ref={provided.innerRef} {...provided.droppableProps} spacing={4} align="stretch">
                          {day.items.map((item, idx) => (
                            <Draggable key={`item-${idx}`} draggableId={`item-${idx}`} index={idx}>
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  bg="white" p={4} borderRadius="md" boxShadow="sm"
                                >
                                  <HStack justify="space-between">
                                    <HStack>
                                      {item.image && (
                                        <img src={item.image} alt={item.title} style={{ width: "70px", height: "70px", borderRadius: "8px", objectFit: "cover" }} />
                                      )}
                                      <Text fontWeight="bold">{item.title}</Text>
                                    </HStack>
                                    <IconButton
                                      icon={<DeleteIcon />}
                                      size="sm"
                                      colorScheme="red"
                                      onClick={() => {
                                        /* 1) 플랜에서 제거 */
                                        const removed = plan.days[selectedDayIndex].items[idx];
                                        const newItems = plan.days[selectedDayIndex].items.filter((_, k) => k !== idx);
                                        const newPlan = { ...plan };
                                        newPlan.days[selectedDayIndex].items = newItems;
                                        setPlan(newPlan);
                                      
                                        /* 2) 추천 목록에 다시 넣기(중복 방지) */
                                        setRecommendedPlaces(prev => {
                                          const exists = prev.some(p => p.title === removed.title);
                                          return exists ? prev : [...prev, {
                                            title: removed.title,
                                            tags:  removed.tags.filter(t => !["도보","버스","택시"].includes(t)), // 교통 태그 제거
                                            image: removed.image,
                                            defaultTime: removed.time,
                                          }];
                                        });
                                      }}
                                    />
                                  </HStack>
                                  <Input mt={2} type="time" value={item.time} onChange={(e) => {
                                    const newPlan = { ...plan };
                                    newPlan.days[selectedDayIndex].items[idx].time = e.target.value;
                                    setPlan(newPlan);
                                  }} />
                                  <HStack mt={2} wrap="wrap">
                                    {item.tags.map((tag, j) => (
                                      <Tag key={j} colorScheme="blue">{tag}</Tag>
                                    ))}
                                  </HStack>
                                </Box>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </VStack>
                      )}
                    </Droppable>
                  </DragDropContext>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>

          <Button leftIcon={<AddIcon />} mt={4} w="full" onClick={onOpen} colorScheme="teal" variant="outline">
            장소에서 일정 추가하기
          </Button>
          <Button mt={4} colorScheme="blue" w="full" onClick={optimizeRoute}>
            🚗 최적 동선 보기
          </Button>
          <Button leftIcon={<CheckIcon />} mt={2} w="full" onClick={onConfirmOpen} colorScheme="green">
            ✅ 확정하기
          </Button>
        </Box>

        <Box flex="1" bg="gray.100" p={0}>
          {plan.days[selectedDayIndex]?.items?.[0]?.lat ? (
            <MapPreview items={plan.days[selectedDayIndex].items} height="calc(100vh - 120px)" />
          ) : (
            <Box h="100%" display="flex" alignItems="center" justifyContent="center">
              <Text color="gray.500">지도 데이터가 없습니다. <br/>오른쪽 상단 “🚗 최적 동선 보기”로 먼저 경로를 계산하세요.</Text>
            </Box>
          )}
        </Box>
      </Flex>

      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>일정을 확정하시겠습니까?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>확정 후에는 편집이 제한될 수 있습니다.</Text>
              <Input
                placeholder="여행 일정명 입력"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onConfirmClose}>취소</Button>
            <Button colorScheme="green" isDisabled={!newTitle} onClick={async () => {
              try {
                await axios.patch(
                  `http://localhost:3000/trip/${tripId}`,
                  { "일정명": newTitle, "여행상태": "완료" },
                  { headers:{ Authorization:`Bearer ${token}` } }
                );
                toast({ title:"일정이 확정되었습니다!", status:"success" });
                onConfirmClose();
                navigate(`/my-plan/${tripId}`);
              } catch (err) {
                toast({ title:"일정 확정 실패", status:"error" });
              }
            }}>
              확정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>장소 선택 후 일정에 추가</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <SimpleGrid columns={2} spacing={4}>
                {recommendedPlaces
                .filter(p => !plan.days[selectedDayIndex].items.some(i => i.title === p.title))
                .map((place, i) => (
                  <Box
                    key={i}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    cursor="pointer"
                    bg={selectedPlace?.title === place.title ? "teal.100" : "white"}
                    onClick={() => {
                      setSelectedPlace(place);
                      setSelectedTime(place.defaultTime || "12:00");
                    }}
                  >
                    <Text fontWeight="bold" mb={2}>{place.title}</Text>
                    {place.image && (
                      <img src={place.image} alt={place.title} style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "6px" }} />
                    )}
                    <HStack mt={2}>
                      {place.tags.map((tag, idx) => (
                        <Tag key={idx} size="sm" colorScheme="blue">{tag}</Tag>
                      ))}
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
              <Input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
              <Select value={selectedTransport} onChange={(e) => setSelectedTransport(e.target.value)}>
                <option value="도보">도보</option>
                <option value="버스">버스</option>
                <option value="택시">택시</option>
              </Select>
              <Button colorScheme="teal" onClick={handleAddSelectedPlace} isDisabled={!selectedPlace}>일정에 추가</Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PlanRecommendationPage;
