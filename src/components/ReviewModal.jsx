import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  HStack,
  VStack,
  Text,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { StarIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

const ReviewModal = ({
  isOpen,
  onClose,
  reviews = [],
  onAddReview,
  onEditReview,
  onDeleteReview,
}) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [editId, setEditId] = useState(null);
  const toast = useToast();

  const handleSubmit = () => {
    if (!reviewText.trim()) {
      toast({
        title: "리뷰 내용을 입력해주세요.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      id: editId || Date.now(),
      text: reviewText,
      rating,
    };

    if (editId) {
      onEditReview?.(payload);
    } else {
      onAddReview?.(payload);
    }

    resetForm();
  };

  const resetForm = () => {
    setReviewText("");
    setRating(5);
    setEditId(null);
  };

  const handleEditClick = (review) => {
    setEditId(review.id);
    setReviewText(review.text);
    setRating(review.rating);
  };

  const handleDeleteClick = (id) => {
    onDeleteReview?.(id);
    if (editId === id) resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>리뷰 작성 및 관리</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  boxSize={6}
                  color={star <= rating ? "yellow.400" : "gray.300"}
                  cursor="pointer"
                  onClick={() => setRating(star)}
                />
              ))}
            </HStack>
            <Textarea
              placeholder="리뷰를 작성하세요."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <Button colorScheme="blue" onClick={handleSubmit}>
              {editId ? "수정 완료" : "등록"}
            </Button>

            {reviews.length > 0 && (
              <>
                <Text fontWeight="bold">작성된 리뷰</Text>
                <VStack spacing={3} align="stretch">
                  {reviews.map((r) => (
                    <HStack
                      key={r.id}
                      justify="space-between"
                      p={2}
                      borderWidth="1px"
                      borderRadius="md"
                    >
                      <HStack>
                        {[...Array(r.rating)].map((_, i) => (
                          <StarIcon key={i} color="yellow.400" />
                        ))}
                        <Text ml={2}>{r.text}</Text>
                      </HStack>
                      <HStack>
                        <IconButton
                          icon={<EditIcon />}
                          size="sm"
                          aria-label="수정"
                          onClick={() => handleEditClick(r)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          aria-label="삭제"
                          onClick={() => handleDeleteClick(r.id)}
                        />
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={handleClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;
