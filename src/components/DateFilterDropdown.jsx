import { useState } from "react";
import {
  Button,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTravel } from "../contexts/TravelContext";

function DateFilterDropdown() {
  const [dateRange, setDateRange] = useState([null, null]);
  const { setTravelData } = useTravel(); // 전역 상태 저장용

  return (
    <Box>
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button variant="outline" colorScheme="blue">
            {dateRange[0] && dateRange[1]
              ? `${dateRange[0].toLocaleDateString()} ~ ${dateRange[1].toLocaleDateString()}`
              : "여행 날짜 추가"}
          </Button>
        </PopoverTrigger>
        <PopoverContent w="auto">
          <PopoverBody>
            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => {
                setDateRange(update);
                setTravelData((prev) => ({
                  ...prev,
                  dateRange: update,
                }));
              }}
              dateFormat="yyyy-MM-dd"
              isClearable
              minDate={new Date()}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}

export default DateFilterDropdown;
