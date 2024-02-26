import React, { useContext, useState, useEffect, useCallback } from "react";

import AuthContext from "../context/AuthContext";
import { formatDateBackend, formatDateReadable } from "../utils/DateTimeUtils"

import { Box, Heading, Text } from "@chakra-ui/react";
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

import Calendar from 'react-calendar';

const HistoryPage = () => {
  const { client } = useContext(AuthContext);

  const [day, setDay] = useState(new Date());
  const [history, setHistory] = useState([])

  // handles date change when the user clicks a day on the calendar component
  const handleDateChange = async (newDate) => {
    try {
      setDay(newDate);
      await loadWorkouts(newDate);
    } catch (error) {
      console.log(error);
    }
  };

  // gets and sets the workouts for a gym session on a specific day
  const loadWorkouts = useCallback(async (selectedDate) => {
    try {
      const specificDate = formatDateBackend(selectedDate);
      const res = await client.get(`api/gymsession/details/${specificDate}`, {});

      if (res.data[0]) {  // if a gym session for specific day exists
        setHistory(res.data[0].workouts);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [client]);

  // loads the workouts for the current day everytime the page rerenders
  useEffect(() => {
    loadWorkouts(day)
  }, [day, loadWorkouts]);

  return (
    <Box>
      <Heading fontFamily="heading" fontWeight="bold" fontSize={{ base: "4xl", md: "5xl" }}>History</Heading>
      <Box fontWeight="medium" fontSize="md" m="8">
        <Calendar
          onChange={handleDateChange}
          value={day}
          className="custom-calendar"
          calendarType="gregory"
        />
      </Box>
      <Text fontFamily="heading" fontWeight="semibold" fontSize="2xl" mt="8">
        {formatDateReadable(day)}
      </Text>
      <Box>
        <TableContainer width="100%">
          <Table variant='simple' __css={{'tableLayout': 'fixed', width: 'full'}} borderWidth={2} borderColor={"#2D2D39"}>
            <Thead>
              <Tr bg="#898DB7">
                <Th fontFamily="heading" fontWeight="medium" fontSize="lg" textAlign="center" color="white" borderWidth={1} borderColor={"#2D2D39"}>Exercise</Th>
                <Th fontFamily="heading" fontWeight="medium" fontSize="lg" textAlign="center" color="white" borderWidth={1} borderColor={"#2D2D39"}>Weight</Th>
                <Th fontFamily="heading" fontWeight="medium" fontSize="lg" textAlign="center" color="white" borderWidth={1} borderColor={"#2D2D39"}>Reps</Th>
              </Tr>
            </Thead>
            <Tbody bg="#51546E">
            {history && history.length > 0 ? ( 
              history.map((workout) => (
                <Tr key={workout.id}>
                  <Td fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"} whiteSpace="normal">{workout.exercise}</Td>
                  <Td fontFamily="body" fontWeight="regular" fontSize={{base:"sm", md:"md"}} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>{workout.weight} lbs</Td>
                  <Td fontFamily="body" fontWeight="regular" fontSize={{base:"sm", md:"md"}} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>{workout.reps}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={3} fontFamily="body" fontWeight="regular" fontSize={{base:"sm", md:"md"}} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>No workout history.</Td>
              </Tr>
            )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default HistoryPage;
