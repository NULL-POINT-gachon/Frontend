import React, { useEffect, useState } from "react";
import InfoRow from "../components/mypage/InfoRow";
import EditableInfoRow from "../components/mypage/EditableInfoRow";
import Header from "../components/Header";
import {
  Box,
  Flex,
  Heading,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
// import axios from "axios"; // 백엔드 연동 시 주석 해제

const ProfilePage = () => {
  const cardBg = useColorModeValue("pink.50", "gray.700");
  const toast = useToast();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // 사용자 정보 가져오기 (백엔드 연동 대비 구조)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const res = await axios.get("/api/user/profile");
        // const data = res.data;

        // 백엔드 연동 전이라 임시 데이터 사용
        const data = {
          nickname: "길동",
          email: "g******@gmail.com",
          phone: "+82 ***-***-1234",
          address: "서울특별시 강남구",
          emergencyContact: "없음",
        };

        setNickname(data.nickname);
        setEmail(data.email);
        setPhone(data.phone);
        setAddress(data.address);
        setEmergencyContact(data.emergencyContact);
      } catch (err) {
        console.error("프로필 불러오기 실패", err);
      }
    };

    fetchProfile();
  }, []);

  // 저장 함수 템플릿 (연동 시 axios.patch 사용)
  const handleSave = async (field, value, setter) => {
    try {
      // await axios.patch("/api/user/profile", { [field]: value });
      setter(value);
      toast({
        title: "저장 완료",
        description: `"${field}" 항목이 수정되었습니다.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "저장 실패",
        description: "서버와의 통신에 실패했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="white.50" minH="100vh">
      <Header />

      {/* 배너 */}
      <Box bgGradient="linear(to-b, blue.200, white)" py={10} textAlign="center" mb={4}>
        <Heading size="lg">개인정보</Heading>
      </Box>

      {/* 개인정보 영역 */}
      <Flex maxW="1000px" mx="auto" px={6} gap={10}>
        <Box flex="1">
          <VStack align="stretch" spacing={4} bg={cardBg} p={4} rounded="lg">
            <InfoRow label="성명" value="홍길동" />
            <EditableInfoRow
              label="닉네임"
              value={nickname}
              onSave={(val) => handleSave("닉네임", val, setNickname)}
            />
            <EditableInfoRow
              label="이메일 주소"
              value={email}
              onSave={(val) => handleSave("이메일 주소", val, setEmail)}
            />
            <EditableInfoRow
              label="전화번호"
              value={phone}
              onSave={(val) => handleSave("전화번호", val, setPhone)}
            />
            <InfoRow label="본인 인증" value="완료됨" />
            <EditableInfoRow
              label="주소"
              value={address}
              onSave={(val) => handleSave("주소", val, setAddress)}
            />
            <EditableInfoRow
              label="비상 연락처"
              value={emergencyContact}
              onSave={(val) => handleSave("비상 연락처", val, setEmergencyContact)}
            />
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProfilePage;
