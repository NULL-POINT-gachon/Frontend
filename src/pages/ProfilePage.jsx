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
  Alert,
  AlertIcon,
  Button,
  Spinner,
  Center
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const cardBg = useColorModeValue("pink.50", "gray.700");
  const toast = useToast();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // 인증 컨텍스트에서 로그인 상태 확인

  // 실제 데이터베이스 구조에 맞는 사용자 상태
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    residence: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 사용자 프로필 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage("");

      try {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log("토큰이 없습니다 - 로그인이 필요합니다");
          setHasError(true);
          setErrorMessage("로그인이 필요합니다");
          setIsLoading(false);
          return;
        }

        // API 요청을 위한 헤더 설정
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        // API 요청 전송
        console.log("프로필 데이터 요청 중...");
        const response = await axios.get("http://localhost:3000/user/profile", config);
        
        console.log("서버 응답:", response.data);

        // 응답 데이터 확인
        if (!response.data.success) {
          throw new Error(response.data.message || "프로필 데이터를 가져오는데 실패했습니다");
        }

        const profileData = response.data.data;
        if (!profileData) {
          throw new Error("프로필 데이터가 없습니다");
        }

        // 실제 사용자 데이터로 상태 업데이트
        setUserData({
          name: profileData.name || "",
          email: profileData.email || "",
          age: profileData.age || "",
          gender: profileData.gender || "",
          residence: profileData.residence || ""
        });

        console.log("프로필 데이터 로드 완료:", profileData);
      } catch (error) {
        console.error("프로필 데이터 로드 오류:", error);
        
        setHasError(true);
        
        if (error.response) {
          // 서버에서 응답이 왔지만 오류 상태 코드인 경우
          console.log("서버 오류 응답:", error.response.data);
          
          if (error.response.status === 401) {
            setErrorMessage("인증이 만료되었습니다. 다시 로그인해 주세요");
            // 인증 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
            setTimeout(() => navigate("/login"), 2000);
          } else {
            setErrorMessage(`서버 오류: ${error.response.data.message || '알 수 없는 오류가 발생했습니다'}`);
          }
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우
          setErrorMessage("서버에 연결할 수 없습니다. 네트워크를 확인해 주세요");
        } else {
          // 요청 설정 중에 오류가 발생한 경우
          setErrorMessage(`오류: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // 페이지 로드 시 데이터 가져오기
    fetchUserData();
  }, [navigate]);

  // 필드 업데이트 함수
  const handleUpdate = async (field, value) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "인증 오류",
          description: "로그인이 필요합니다",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // 필드명 매핑 (UI 레이블 -> API 필드)
      const apiFieldMapping = {
        "이름": "name",
        "이메일": "email",
        "나이": "age",
        "성별": "gender",
        "주소": "residence"
      };
      
      const apiField = apiFieldMapping[field];
      if (!apiField) {
        console.error(`매핑되지 않은 필드: ${field}`);
        return;
      }

      // 숫자 필드는 숫자로 변환
      const processedValue = apiField === 'age' ? parseInt(value, 10) : value;

      // API 요청을 위한 헤더 설정
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // API 요청 전송
      console.log(`${field} 업데이트 중...`, processedValue);
      const response = await axios.patch(
        "http://localhost:3000/user/profile",
        { [apiField]: processedValue },
        config
      );

      console.log("업데이트 응답:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "업데이트 실패");
      }

      // 성공적으로 업데이트된 경우 상태 업데이트
      setUserData(prev => ({
        ...prev,
        [apiField]: processedValue
      }));

      // 성공 메시지는 EditableInfoRow 컴포넌트에서 처리
    } catch (error) {
      console.error(`${field} 업데이트 오류:`, error);
      
      toast({
        title: "업데이트 실패",
        description: error.response?.data?.message || "서버 통신 중 오류가 발생했습니다",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 성별 표시 형식 변환
  const formatGender = (gender) => {
    if (!gender) return "미설정";
    if (gender === "male") return "남성";
    if (gender === "female") return "여성";
    return gender;
  };

  // 로그인 페이지로 이동
  const handleGoToLogin = () => {
    navigate("/login");
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
          {isLoading ? (
            <Center p={10}>
              <Spinner size="xl" color="blue.500" />
              <Box ml={4}>데이터를 불러오는 중...</Box>
            </Center>
          ) : hasError ? (
            <Box>
              <Alert status="warning" mb={4}>
                <AlertIcon />
                {errorMessage}
              </Alert>
              
              {errorMessage.includes("로그인") && (
                <Box textAlign="center" mt={4} mb={6}>
                  <Button colorScheme="blue" onClick={handleGoToLogin}>
                    로그인 페이지로 이동
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <VStack align="stretch" spacing={4} bg={cardBg} p={4} rounded="lg">
              <EditableInfoRow
                label="이름"
                value={userData.name}
                onSave={(val) => handleUpdate("이름", val)}
              />
              <EditableInfoRow
                label="이메일"
                value={userData.email}
                onSave={(val) => handleUpdate("이메일", val)}
              />
              <EditableInfoRow
                label="나이"
                value={userData.age ? userData.age.toString() : ""}
                onSave={(val) => handleUpdate("나이", val)}
              />
              <EditableInfoRow
                label="성별"
                value={formatGender(userData.gender)}
                onSave={(val) => handleUpdate("성별", val)}
              />
              <EditableInfoRow
                label="주소"
                value={userData.residence || ""}
                onSave={(val) => handleUpdate("주소", val)}
              />
            </VStack>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ProfilePage;