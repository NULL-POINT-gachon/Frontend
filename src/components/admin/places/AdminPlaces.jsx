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
} from "@chakra-ui/react";
import EditPlaceModal from "./EditPlaceModal";
import { useNavigate } from "react-router-dom";
import dummyPlaces from "../../../data/dummyPlaces";

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

  useEffect(() => {
    try {
      setPlaces(dummyPlaces);
    } catch (err) {
      setError(true);
    }
  }, []);

  const handleEdit = (place) => {
    setSelectedPlace(place);
    onOpen();
  };

  const handleSave = (updated) => {
    if (updated.id) {
      setPlaces((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      setPlaces((prev) => [...prev, { ...updated, id: Date.now() }]);
    }
    onClose();
  };

  const confirmDelete = (id) => {
    setTargetId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setPlaces((prev) => prev.filter((p) => p.id !== targetId));
    setIsDeleteOpen(false);
  };

  const filtered = places
    .filter((p) => {
      return (
        p.name.includes(searchTerm) ||
        p.region.includes(searchTerm) ||
        p.tag.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      if (sortOption === "등록 오래된 순") return new Date(a.registeredAt) - new Date(b.registeredAt);
      if (sortOption === "최신등록순") return new Date(b.registeredAt) - new Date(a.registeredAt);
      return 0;
    });

  return (
    <Box p={6}>
      <Heading size="md" mb={4}>여행지 관리</Heading>

      <HStack justify="space-between" mb={4} flexWrap="wrap">
        <Input
          placeholder="장소명, 주소 또는 태그 검색"
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
              <Th>주소</Th>
              <Th>태그</Th>
              <Th>등록일</Th>
              <Th>등록자</Th>
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
                <Td>{place.region}</Td>
                <Td>{place.tag}</Td>
                <Td>{place.registeredAt}</Td>
                <Td>{place.registeredBy}</Td>
                <Td>
                  <Button size="sm" colorScheme="red" onClick={() => confirmDelete(place.id)}>
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
