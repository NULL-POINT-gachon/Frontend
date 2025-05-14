// src/components/ScheduleCard.jsx
import React from "react";
import { Box, Button, HStack, Text, IconButton } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { DeleteIcon } from "@chakra-ui/icons";
const ScheduleCard = ({ item, onDelete, onReview }) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" w="100%">
      <HStack justify="space-between">
        <Text fontWeight="bold">{item.title}</Text>
        <Button variant="ghost" onClick={onReview}>
          <StarIcon boxSize="20px" color="gray.500" /> 리뷰
        </Button>
      </HStack>
      <Text>{item.desc}</Text>
      <Text mt={1} fontSize="sm" color="gray.600">
        ⏰ {item.time} / 🚗 {item.transport}
      </Text>
      <IconButton
          aria-label="삭제" icon={<DeleteIcon/>}
          size="sm" colorScheme="red"
          onClick={onDelete}
      />
    </Box>
  );
};

export default ScheduleCard;
