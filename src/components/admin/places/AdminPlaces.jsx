import React, { useEffect, useState, useRef } from "react";
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button,
  Input, Select, Text, HStack, useDisclosure, AlertDialog,
  AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
  AlertDialogBody, AlertDialogFooter, useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditPlaceModal from "./EditPlaceModal";

const AdminPlaces = () => {
  /* ───────── state ───────── */
  const [places, setPlaces]           = useState([]);
  const [searchTerm, setSearchTerm]   = useState("");
  const [sortOption, setSortOption]   = useState("등록일순");
  const [error, setError]             = useState(false);

  const { isOpen, onOpen, onClose }   = useDisclosure();
  const [selectedPlace, setSelPlace]  = useState(null);

  const [isDeleteOpen, setDelOpen]    = useState(false);
  const cancelRef                     = useRef();
  const [targetId, setTargetId]       = useState(null);

  const navigate = useNavigate();
  const toast    = useToast();

  /* ───────── data fetch ───────── */
  const fetchPlaces = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title:"로그인이 필요합니다", status:"error" });
        navigate("/login");
        return;
      }
      const { data } = await axios.get(
        "http://localhost:3000/admin/destinations",
        { headers:{ Authorization:`Bearer ${token}` } }
      );
      if (data.success) setPlaces(data.data);
      else               throw new Error("데이터 수신 실패");
    } catch (err) {
      console.error(err);
      setError(true);
      toast({ title:"오류 발생", description:err.message, status:"error" });
    }
  };

  useEffect(()=>{ fetchPlaces(); },[]);

  /* ───────── 신규·수정 모달 열기 ───────── */
  const handleEdit = (place = null) => {
    setSelPlace(place);   // null → ‘등록’, 객체 → ‘수정’
    onOpen();
  };

  /* ───────── 저장(PATCH / POST) ───────── */
  const handleSave = async (updated) => {
    try {
      const token = localStorage.getItem("token");
      const url   = updated.id
        ? `http://localhost:3000/admin/destinations/${updated.id}`
        : "http://localhost:3000/admin/destinations";
      const method = updated.id ? "patch" : "post";

      await axios[method](url, { ...updated, admission_fee: updated.admission_fee ?? 0 },
        { headers:{ Authorization:`Bearer ${token}` } });

      toast({
        title: updated.id ? "수정 완료" : "등록 완료",
        status:"success"
      });
      onClose();
      setSelPlace(null);
      fetchPlaces();
    } catch (err) {
      console.error(err);
      toast({ title:"오류 발생", description:err.message, status:"error" });
    }
  };

  /* ───────── 삭제 ───────── */
  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/admin/destinations/${targetId}`,
        { headers:{ Authorization:`Bearer ${token}` } });
      toast({ title:"삭제 성공", status:"success" });
      fetchPlaces();
    } catch (err) {
      toast({ title:"삭제 실패", description:err.message, status:"error" });
    }
    setDelOpen(false);
  };

  /* ───────── 필터/정렬 ───────── */
  const term = searchTerm.trim().toLowerCase();
  const filtered = places
    .filter(p=>{
      if(p.status===0) return false;
      if(!term) return true;
      return (
        p.destination_name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)      ||
        p.category?.toLowerCase().includes(term)
      );
    })
    .sort((a,b)=>{
      if(sortOption==="등록 오래된 순") return a.id - b.id;
      if(sortOption==="최신 등록 순")  return b.id - a.id;
      return 0;
    });

  /* ───────── view ───────── */
  return (
    <Box p={6}>
      <Heading size="md" mb={4}>여행지 관리</Heading>

      {/* 검색/정렬/등록 */}
      <HStack justify="space-between" mb={4} flexWrap="wrap">
        <Input
          placeholder="장소·설명·카테고리 검색"
          maxW="300px"
          value={searchTerm}
          onChange={e=>setSearchTerm(e.target.value)}
        />
        <Select maxW="180px" value={sortOption} onChange={e=>setSortOption(e.target.value)}>
          <option value="등록 오래된 순">등록 오래된 순</option>
          <option value="최신 등록 순">최신 등록 순</option>
        </Select>
        <Button colorScheme="blue" onClick={handleEdit}>여행지 등록</Button>
      </HStack>

      {/* 목록 */}
      {error ? (
        <Text color="red.500">장소 정보를 불러올 수 없습니다.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr><Th>장소명</Th><Th>카테고리</Th><Th>입장료</Th><Th>관리</Th></Tr>
          </Thead>
          <Tbody>
            {filtered.map(place=>(
              <Tr key={place.id}>
                <Td
                  cursor="pointer"
                  _hover={{ textDecoration:"underline", color:"teal.600" }}
                  onClick={()=>navigate(`/admin/places/${place.id}`)}
                >
                  {place.destination_name}
                </Td>
                <Td>{place.category}</Td>
                <Td>{place.admission_fee ? `${place.admission_fee}원` : "무료"}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue" mr={2}
                          onClick={()=>handleEdit(place)}>수정</Button>
                  <Button size="sm" colorScheme="red"
                          onClick={()=>{ setTargetId(place.id); setDelOpen(true); }}>
                    삭제
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* ─── 모달 & 삭제 확인창 ─── */}
      <EditPlaceModal
        isOpen={isOpen}
        onClose={()=>{ onClose(); setSelPlace(null); }}
        place={selectedPlace}
        onSave={handleSave}
      />

      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef}
                   onClose={()=>setDelOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">여행지 삭제</AlertDialogHeader>
            <AlertDialogBody>정말 삭제하시겠습니까?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={()=>setDelOpen(false)}>취소</Button>
              <Button colorScheme="red" ml={3} onClick={handleConfirmDelete}>삭제</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default AdminPlaces;
