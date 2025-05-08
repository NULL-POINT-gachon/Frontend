import React from "react";
import { hotPlaces } from "../data/hotPlaces";
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
  const navigate = useNavigate();

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
                <Text fontSize="sm" color="gray.600">{place.description}</Text>
                <Text fontSize="sm" color="blue.600" mt={1}>
                평점 {place.rating}
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
    </Box>
  );
};

export default HotDestinations;
