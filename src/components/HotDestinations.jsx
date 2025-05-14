import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import {
  Box,
  Image,
  Text,
  Heading,
  Button,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const handleCardClick = (e) => {
  // slick이 li.slick-slide 에 넣어주는 data-index
  const idx = Number(e.currentTarget.getAttribute("data-index"));
  const trueIdx = ((idx % hotPlaces.length) + hotPlaces.length) % hotPlaces.length; // 음수 보정
  const placeId = hotPlaces[trueIdx].id;
  navigate(`/hot-destinations/${placeId}`);
};

// ▶ 커스텀 이전 버튼
const CustomPrevArrow = ({ onClick }) => (
  <IconButton
    icon={<ChevronLeftIcon boxSize={6} />}
    onClick={onClick}
    position="absolute"
    left="-40px"
    top="50%"
    transform="translateY(-50%)"
    zIndex={2}
    bg="white"
    boxShadow="md"
    _hover={{ bg: "gray.100" }}
    aria-label="이전"
  />
);

// ▶ 커스텀 다음 버튼
const CustomNextArrow = ({ onClick }) => (
  <IconButton
    icon={<ChevronRightIcon boxSize={6} />}
    onClick={onClick}
    position="absolute"
    right="-40px"
    top="50%"
    transform="translateY(-50%)"
    zIndex={2}
    bg="white"
    boxShadow="md"
    _hover={{ bg: "gray.100" }}
    aria-label="다음"
  />
);

const HotDestinations = () => {
  const [hotPlaces, setHotPlaces] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
       (async()=>{
         try{
           const { data } = await axios.get("http://localhost:3000/review/hot-destinations");
           console.log(data);
           if(data.result_code===200) setHotPlaces(data.data);
         }catch(e){ console.error(e); }
       })();
     },[]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box overflow="visible" px={4}>
      <Heading size="lg" mb={6}>🔥 요즘 핫한 여행지</Heading>
      {hotPlaces.length === 0 ? (
       <Text color="gray.500">최근 일주일간 인기 여행지가 없습니다.</Text>
     ) : (
      <Slider {...settings}>
        {hotPlaces.map((place) => (
          <Box
            key={place.id}
            p={4}
            mx={2}
            bg="gray.50"
            borderRadius="md"
            boxShadow="md"
            _hover={{ boxShadow: "xl", cursor: "pointer" }}
            onClick={() => navigate(`/hot-destinations/${place.id}`)}
          >
            <VStack spacing={3} align="start">
              <Image
                src={place.image}
                alt={place.title}
                boxSize="100%"
                maxH="140px"
                objectFit="cover"
                borderRadius="md"
                w="100%"
              />
              <Box>
                <Text fontWeight="bold" fontSize="lg">{place.title}</Text>
                <Text fontSize="sm" color="blue.600" mt={1}>
                   리뷰 {place.review_count} · 평점 {place.rating}
                </Text>
              </Box>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/hot-destinations/${place.id}`);
                }}
              >
                자세히 보기
              </Button>
            </VStack>
          </Box>
        ))}
      </Slider>
      )}
    </Box>
  );
};

export default HotDestinations;
