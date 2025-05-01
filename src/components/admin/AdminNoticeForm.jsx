import React from "react";
import {
    Box, Button, FormControl, FormLabel, Input,
    Textarea, useToast
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  const AdminNoticeForm = ({ initialData = {}, onSubmit }) => {
    const toast = useToast();
    const [title, setTitle] = useState(initialData.title || "");
    const [content, setContent] = useState(initialData.content || "");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title || !content) {
        toast({ title: "제목과 내용을 모두 입력해주세요.", status: "warning", duration: 2000 });
        return;
      }
      onSubmit({ title, content });
    };
  
    return (
      <Box as="form" onSubmit={handleSubmit} maxW="600px" mx="auto" p={6} bg="white" borderRadius="md" boxShadow="sm">
        <FormControl mb={4}>
          <FormLabel>제목</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>내용</FormLabel>
          <Textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
        </FormControl>
        <Button colorScheme="teal" type="submit">저장</Button>
      </Box>
    );
  };
  
  export default AdminNoticeForm;
  