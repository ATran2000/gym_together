import React, { useContext, useState, useEffect, useCallback } from "react";

import AuthContext from "../context/AuthContext";

import { Box, Heading, Text } from "@chakra-ui/react";
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Need this import in order to style react-calendar

const HistoryPage = () => {
  let { client } = useContext(AuthContext);

  let [day, setDay] = useState(new Date());
  let [history, setHistory] = useState([])

  // this function converts dates like Mon Jan 1 2024 00:00:00 GMT-0500 (Eastern Standard Time) to 2024-01-01
  // this date will be sent to the backend and is needed because my date field for my model rquires it
  let formatDate = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  // handles date change when the user clicks a day on the calendar component
  let handleDateChange = (newDate) => {
    setDay(newDate);
    getGymSession(newDate);
  };

  // gets and sets the workout for a gym session for a specfic day
  let getGymSession = useCallback((selectedDate) => {
    let specificDate = formatDate(selectedDate);

    client.get(`api/gymsession/details/${specificDate}`, {})
    .then(function (res) {
      if (res.data[0]) {
        setHistory(res.data[0].workouts)
      } else {
        setHistory([])
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }, [client]);

  // gets the gym session for the current day everytime the page rerenders
  useEffect(() => {
    getGymSession(day)
  }, [day, getGymSession]);

  return (
    <Box>
      <Heading display={{ base: "none", md: "block" }} fontFamily="heading" fontWeight="bold" fontSize="5xl">History</Heading>
      <Heading display={{ base: "block", md: "none" }} fontFamily="heading" fontWeight="bold" fontSize="4xl">History</Heading>
      <Box fontWeight="medium" fontSize="md" m="8">
        <Calendar
          onChange={handleDateChange}
          value={day}
          className="custom-calendar"
          calendarType="gregory"
        />
      </Box>
      <Text fontFamily="heading" fontWeight="semibold" fontSize="2xl" mt="8">
        {/* converts dates like 2024-01-01 to Mon Jan 1 2024 00:00:00 GMT-0500 (Eastern Standard Time) for readibility */}
        {day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
