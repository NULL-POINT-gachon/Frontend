import { Box, useRadio } from "@chakra-ui/react";

function SelectableCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
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
