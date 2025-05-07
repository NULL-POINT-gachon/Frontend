// src/components/admin/places/AdminPlaceDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  VStack,
  Spinner,
  HStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import EditPlaceDetailModal from "./EditPlaceDetailModal";
import dummyPlaces from "../../../data/dummyPlaces";

const AdminPlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isOpen: isDeleteOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    const found = dummyPlaces.find((p) => p.id === parseInt(id));
    setTimeout(() => {
      if (found) setPlace(found);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleDelete = async () => {
    try {
      const success = Math.random() > 0.5;
      if (!success) throw new Error("서버 오류");
      toast({
        title: "삭제가 완료되었습니다.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/admin/places");
    } catch {
      toast({
        title: "삭제 실패",
        description: "잠시 후 다시 시도해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = (updatedData) => {
    setPlace(updatedData);
    toast({
      title: "장소 정보가 수정되었습니다.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    onEditClose();
  };

  if (loading) return <Spinner mt={10} />;

  if (!place)
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="lg" color="red.500" mb={4}>해당 장소를 찾을 수 없습니다.</Text>
        <Button onClick={() => navigate(-1)}>돌아가기</Button>
      </Box>
    );

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>장소 상세 정보</Heading>

      <VStack align="start" spacing={4}>
        <Image src={place.image} alt={place.name} borderRadius="md" />
        <Text fontSize="xl" fontWeight="bold">{place.name}</Text>
        <Text>주소: {place.region}</Text>
        <Text>태그: {place.tag}</Text>
        <Text>설명: {place.description}</Text>
        <Text>리뷰 수: {place.reviewStats?.count ?? 0}</Text>
        <Text>평균 평점: ⭐ {place.reviewStats?.avg ?? 0}</Text>
        <Text>등록일: {place.registeredAt}</Text>
        <Text>등록자: {place.registeredBy}</Text>

        <HStack pt={4}>
          <Button colorScheme="blue" onClick={onEditOpen}>수정</Button>
          <Button colorScheme="red" onClick={onOpen}>삭제</Button>
        </HStack>
      </VStack>

      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>삭제 확인</AlertDialogHeader>
            <AlertDialogBody>정말 이 장소를 삭제하시겠습니까?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>취소</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>삭제</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <EditPlaceDetailModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        place={place}
        onSave={handleSave}
      />
    </Box>
  );
};

export default AdminPlaceDetail;
