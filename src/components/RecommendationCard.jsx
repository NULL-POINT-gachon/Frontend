import React from "react";
import { Box, Image, Text, Badge, Wrap, WrapItem } from "@chakra-ui/react";

function RecommendationCard({ title, description, image, tags, isSelected, onClick }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onClick?.();
    }
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      borderWidth="2px"
      borderColor={isSelected ? "blue.400" : "gray.200"}
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      boxShadow={isSelected ? "lg" : "sm"}
      transition="all 0.2s"
      _hover={{ boxShadow: "md", borderColor: "blue.300" }}
      _focus={{ outline: "none", ring: 2, ringColor: "blue.300" }}
    >
      <Image
        src={image}
        alt={`${title} 미리보기`}
        objectFit="cover"
        w="100%"
        h="200px"
      />

      <Box p={4}>
        <Text fontSize="xl" fontWeight="bold" mb={1}>
          {title}
        </Text>
        <Text fontSize="sm" color="gray.600" mb={2}>
          {description}
        </Text>
        <Wrap>
          {tags.map((tag, idx) => (
            <WrapItem key={idx}>
              <Badge colorScheme="blue" borderRadius="full" px={2}>
                {tag}
              </Badge>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </Box>
  );
}

export default RecommendationCard;
