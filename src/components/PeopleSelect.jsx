import { Box, Button, SimpleGrid } from "@chakra-ui/react";

const options = ["1인", "2인", "3~4인", "5인 이상"];

function PeopleSelect({ value, onChange }) {
  return (
    <Box>
      <SimpleGrid columns={3} spacing={4}>
        {options.map((label) => (
          <Button
            key={label}
            variant={value === label ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => onChange(label)}
          >
            {label}
          </Button>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default PeopleSelect;
