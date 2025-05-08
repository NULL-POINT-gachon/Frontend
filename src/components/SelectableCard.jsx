import React from "react";
import { Box, useRadio } from "@chakra-ui/react";

function SelectableCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input    = getInputProps();
  const radioBox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...radioBox}
        cursor="pointer"
        borderWidth="2px"
        borderRadius="full"
        boxShadow="md"
        textAlign="center"
        px={6}
        py={3}
        fontWeight="bold"
        _checked={{
          bg: "blue.500",
          color: "white",
          borderColor: "blue.600",
        }}
        _hover={{ bg: "blue.50" }}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default SelectableCard;
