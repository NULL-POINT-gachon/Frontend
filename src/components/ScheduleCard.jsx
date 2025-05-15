// src/components/ScheduleCard.jsx
import React from "react";
import { Box, Button, HStack, Text, IconButton } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { DeleteIcon } from "@chakra-ui/icons";
const ScheduleCard = ({ item, onDelete, onReview, hasReview = false }) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" w="100%" position="relative">
      {/* 리뷰 작성 시 노란별 배지 표시 */}
      {hasReview && (
        <Box
          position="absolute"
          top="2"
          right="2"
          bgColor="yellow.400"
          color="white"
          borderRadius="full"
          px="2"
          py="1"
          fontSize="xs"
          fontWeight="bold"
        >
          ⭐ 리뷰완료
        </Box>
      )}
      
      <HStack justify="space-between">
        <Text fontWeight="bold">{item.title}</Text>
        <Button variant="ghost" onClick={onReview}>
          <StarIcon 
            boxSize="20px" 
            color={hasReview ? "yellow.400" : "gray.500"} 
          /> 
          리뷰
        </Button>
      </HStack>
      <Text>{item.desc}</Text>
      <Text mt={1} fontSize="sm" color="gray.600">
        ⏰ {item.time} / 🚗 {item.transport}
      </Text>
      <IconButton
        aria-label="삭제" 
        icon={<DeleteIcon/>}
        size="sm" 
        colorScheme="red"
        onClick={onDelete}
      />
    </Box>
  );
};

export default ScheduleCard;
