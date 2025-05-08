// src/components/admin/places/AdminPlaces.jsx
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

      const response = await axios.get('http://localhost:3000/admin/destinations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPlaces(response.data.data);
      }
    } catch (error) {
      console.error("여행지 목록 가져오기 오류:", error);
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
    fetchPlaces();
  }, []);

  const handleEdit = (place) => {
    setSelectedPlace(place);
    onOpen();
  };

  const handleSave = async (updated) => {
    try {
      const token = localStorage.getItem('token');
      if (updated.id) {
        // 수정
        await axios.patch(
          `http://localhost:3000/admin/destinations/${updated.id}`,
          updated,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast({
          title: "수정 성공",
          description: "여행지 정보가 수정되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // 새로 등록
        await axios.post(
          'http://localhost:3000/admin/destinations',
          updated,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast({
          title: "등록 성공",
          description: "새 여행지가 등록되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      fetchPlaces(); // 목록 새로고침
      onClose();
    } catch (error) {
      toast({
        title: "오류 발생",
        description: error.response?.data?.message || "처리 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:3000/admin/destinations/${targetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast({
        title: "삭제 성공",
        description: "여행지가 삭제되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      fetchPlaces(); // 목록 새로고침
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

  const filtered = places
    .filter((p) => {
      return (
        (p.status !== 0) && // 비활성 상태가 아닌 경우만 표시
        (p.name?.includes(searchTerm) ||
        p.description?.includes(searchTerm) ||
        p.category?.includes(searchTerm))
      );
    })
    .sort((a, b) => {
      if (sortOption === "등록 오래된 순") return a.id - b.id;
      if (sortOption === "최신등록순") return b.id - a.id;
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
              <Th>실내/실외</Th>
              <Th>입장료</Th>
              <Th>관리</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((place) => (
              <Tr key={place.id}>
                <Td
                  cursor="pointer"
                  _hover={{ textDecoration: "underline", color: "teal.600" }}
                  onClick={() => navigate(`/admin/places/${place.id}`)}
                >
                  {place.name}
                </Td>
                <Td>{place.category}</Td>
                <Td>{place.indoor_outdoor}</Td>
                <Td>{place.admission_fee ? `${place.admission_fee}원` : '무료'}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue" mr={2} onClick={() => handleEdit(place)}>
                    수정
                  </Button>
                  <Button size="sm" colorScheme="red" onClick={() => {
                    setTargetId(place.id);
                    setIsDeleteOpen(true);
                  }}>
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
