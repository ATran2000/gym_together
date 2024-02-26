import React, { useContext, useState, useEffect, useCallback } from "react";

import AuthContext from "../context/AuthContext";
import { formatDateBackend, formatDateReadable, formatTime12to24, formatTime24To12 } from "../utils/DateTimeUtils"

import { Box, Heading, Button, Text } from "@chakra-ui/react";
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react'

import Calendar from 'react-calendar';

const SchedulePage = () => {
  const { client, csrfToken } = useContext(AuthContext);

  const [day, setDay] = useState(new Date());
  const [schedule, setSchedule] = useState([])

  const [isOpenScheduleModal, setOpenScheduleModal] = useState(false);

  const toggleScheduleModal = () => {
    setOpenScheduleModal(!isOpenScheduleModal);
  };

  // handles date change when the user clicks a day on the calendar component
  const handleDateChange = async (newDate) => {
    try {
      setDay(newDate);
      await loadSchedule(newDate);
    } catch (error) {
      console.log(error);
    }
  };

  // gets and sets the schedule for a gym session for a specfic day
  const loadSchedule = useCallback(async (selectedDate) => {
    try {
      let specificDate = formatDateBackend(selectedDate);
      const res = await client.get(`api/gymsession/details/${specificDate}`, {});

      setSchedule(res.data[0])
    } catch (error) {
      console.log(error)
    }
  }, [client]);

  // handles submitting a new schedule for a day
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await client.post("api/gymsession/schedule/", {
        day: e.target.day.value,
        time: formatTime12to24(e.target.time.value),
        target_muscles: e.target.target_muscles.value
      }, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
  
      // updates the schedule and closes the modal after successful submit
      setSchedule({"time": e.target.time.value, "target_muscles": e.target.target_muscles.value});
      toggleScheduleModal();
    } catch (error) {
      console.log(error);
    }
  }

  // loads the schedule for the current day everytime the page rerenders
  useEffect(() => {
    loadSchedule(day)
  }, [day, loadSchedule]);

  return (
    <Box>
      <Heading fontFamily="heading" fontWeight="bold" fontSize={{ base: "4xl", md: "5xl" }}>Schedule</Heading>
      <Button onClick={toggleScheduleModal} width={{base:"80%", md:"60"}} fontFamily="heading" fontWeight="semibold" fontSize="2xl" bg="#898DB7" _hover={{ bg: '#51546E' }} color="white" m={8}>
          Schedule Gym Session
      </Button>
      <Box fontWeight="medium" fontSize="md" mt="8" mb="8">
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
                <Th fontFamily="heading" fontWeight="medium" fontSize="lg" textAlign="center" color="white" borderWidth={1} borderColor={"#2D2D39"}>Time</Th>
                <Th fontFamily="heading" fontWeight="medium" fontSize="lg" textAlign="center" color="white" borderWidth={1} borderColor={"#2D2D39"}>Target Muscles</Th>
              </Tr>
            </Thead>
            <Tbody bg="#51546E">
            {schedule ? ( 
              <Tr>
                <Td fontFamily="body" fontWeight="regular" fontSize={{base:"sm", md:"md"}} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>{formatTime24To12(schedule.time)}</Td>
                <Td fontFamily="body" fontWeight="regular" fontSize={{base:"sm", md:"md"}} textAlign="center" borderWidth={1} borderColor={"#2D2D39"} whiteSpace="normal">{schedule.target_muscles}</Td>
              </Tr>
            ) : (
              <Tr>
                <Td colSpan={2} fontFamily="body" fontWeight="regular" fontSize={{base:"sm", md:"md"}} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>Rest Day? If not schedule a session!</Td>
              </Tr>
            )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* popup modal for scheduling gym sessions */}
      <Modal isOpen={isOpenScheduleModal} onClose={toggleScheduleModal} size={{base:"sm", md:"md"}}>
        <ModalOverlay />
        <ModalContent bg="#51546E">
          <ModalHeader fontFamily="heading" fontWeight="semibold" fontSize="2xl">
            Schedule A Gym Session
            <Text fontWeight="medium" fontSize="lg">{formatDateReadable(day)}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <form onSubmit={handleScheduleSubmit}>
                <FormControl mb={8}>
                  <Input type='hidden' id="day" value={formatDateBackend(day)} /> {/* note that day input is hidden and automatically given */}
                  <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Time</FormLabel>
                  <Input type='time' id="time" fontFamily="body" fontWeight="regular" fontSize="md" />
                  <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md" mt="4">Target Muscles</FormLabel>
                  <Input type='text' id="target_muscles" fontFamily="body" fontWeight="regular" fontSize="md" placeholder="Target Muscles" />
                </FormControl>
                <Button type="submit" fontFamily="heading" fontWeight="medium" bg="#898DB7" _hover={{ bg: '#51546E' }} color="white" width="100%" mb={4}>
                    Schedule
                </Button>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SchedulePage;
