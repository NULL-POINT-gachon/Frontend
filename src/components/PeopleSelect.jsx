import { Box, Text, SimpleGrid, useRadioGroup } from "@chakra-ui/react";
import SelectableCard from "./SelectableCard";

const peopleOptions = [
  { label: "혼자", value: "1인" },
  { label: "2인", value: "2인" },
  { label: "3~4인", value: "3~4인" },
  { label: "5인 이상", value: "5인 이상" },
];

function PeopleSelect({ value, onChange }) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "people",
    defaultValue: value,
    onChange,
  });

  const group = getRootProps();

  return (
    <Box textAlign="center">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        함께하는 여행 인원을 선택해주세요
      </Text>

      <SimpleGrid columns={[2, 4]} spacing={4} {...group}>
        {peopleOptions.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <SelectableCard key={option.value} {...radio}>
              {option.label}
            </SelectableCard>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

export default PeopleSelect;
