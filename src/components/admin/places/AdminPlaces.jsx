import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Select,
  Text,
  HStack,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import EditPlaceModal from "./EditPlaceModal";
import { useNavigate } from "react-router-dom";

const AdminPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("등록일순");
  const [error, setError] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const cancelRef = useRef();
  const [targetId, setTargetId] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchPlaces = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "로그인이 필요합니다",
          description: "관리자 페이지 접근을 위해 로그인해주세요.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3000/admin/destinations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPlaces(response.data.data);
      } else {
        throw new Error("데이터 수신 실패");
      }
    } catch (error) {
      console.error("여행지 목록 가져오기 오류:", error);
      setError(true);
      toast({
        title: "오류 발생",
        description: error.message || "처리 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleEdit = (place) => {
    console.log("> place", place);
    setSelectedPlace(place);
    onOpen();
  };

  const handleSave = async (updated) => {
    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        ...updated,
        admission_fee: updated.admission_fee || 0, // 기본값 처리 (필요 시)
      };

      let response;
      if (updated.id) {
        response = await axios.patch(
          `http://localhost:3000/admin/destinations/${updated.id}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post("http://localhost:3000/admin/destinations", updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.data.success) {
        toast({
          title: updated.id ? "수정 완료" : "등록 완료",
          description: updated.id
            ? "여행지 정보가 성공적으로 수정되었습니다."
            : "새 여행지가 등록되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        setSelectedPlace(null);
        await fetchPlaces();
      } else {
        throw new Error(response.data.message || "요청 실패");
      }
    } catch (error) {
      console.error("저장 중 오류:", error);
      toast({
        title: "오류 발생",
        description: error.message || "처리 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/admin/destinations/${targetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "삭제 성공",
        description: "여행지가 삭제되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      await fetchPlaces();
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: error.response?.data?.message || "삭제 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsDeleteOpen(false);
  };

  const term = searchTerm.trim().toLowerCase();          // ① 공백 제거 + 소문자화

  const filtered = places
    .filter(p => {
      if (p.status === 0) return false;                  // ② status 필터
    
      if (!term) return true;                            // ③ 검색어 없으면 통과
    
      /* ④ 소문자로 비교, 컬럼명 맞추기 */
      return (
        p.destination_name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)      ||
        p.category?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {                                    // ⑤ 정렬
      if (sortOption === "등록 오래된 순") return a.id - b.id;
      if (sortOption === "최신 등록 순" )  return b.id - a.id;
      return 0;
    });
  
  return (
    <Box p={6}>
      <Heading size="md" mb={4}>여행지 관리</Heading>

      <HStack justify="space-between" mb={4} flexWrap="wrap">
        <Input
          placeholder="장소명, 설명 또는 카테고리 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="300px"
        />
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          maxW="180px"
        >
          <option value="등록 오래된 순">등록 오래된 순</option>
          <option value="최신등록순">최신 등록 순</option>
        </Select>
        <Button colorScheme="blue" onClick={() => handleEdit(null)}>
          여행지 등록
        </Button>
      </HStack>

      {error ? (
        <Text color="red.500" fontWeight="bold">장소 정보를 불러올 수 없습니다</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>장소명</Th>
              <Th>카테고리</Th>
              <Th>입장료</Th>
              <Th>관리</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((place) => (
              console.log("> place", place),
              <Tr key={place.id}>
                <Td
                  cursor="pointer"
                  _hover={{ textDecoration: "underline", color: "teal.600" }}
                  onClick={() => navigate(`/admin/places/${place.id}`)}
                >
                  {place.destination_name}
                </Td>
                <Td>{place.category}</Td>
                <Td>{place.admission_fee ? `${place.admission_fee}원` : "무료"}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue" mr={2} onClick={() => handleEdit(place)}>
                    수정
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => {
                      setTargetId(place.id);
                      setIsDeleteOpen(true);
                    }}
                  >
                    삭제
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <EditPlaceModal
        isOpen={isOpen}
        onClose={onClose}
        place={selectedPlace}
        onSave={handleSave}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              여행지 삭제
            </AlertDialogHeader>
            <AlertDialogBody>
              정말 이 여행지를 삭제하시겠습니까?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                취소
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default AdminPlaces;