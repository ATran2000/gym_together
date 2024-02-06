import React, { useContext, useState, useEffect, useCallback } from "react";

import AuthContext from "../context/AuthContext";

import { Box, Container, Heading, Button, Text } from "@chakra-ui/react";
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react'

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Need this import in order to style react-calendar

import Navbar from "../components/Navbar"

const SchedulePage = () => {
  let { client } = useContext(AuthContext);

  let [day, setDay] = useState(new Date());
  let [schedule, setSchedule] = useState([])

  let [isOpenScheduleModal, setOpenScheduleModal] = useState(false);

  let toggleScheduleModal = () => {
    setOpenScheduleModal(!isOpenScheduleModal);
  };

  // function that will be used to get the csrftoken cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;  // Get the entire cookie string from the document
    const parts = value.split(`; ${name}=`);  // Split the cookie string into an array of substrings, using the provided cookie name as the delimiter

    if (parts.length === 2) {  // Check if there are two parts in the array
      // If there are two parts, pop the last element, which contains the value of the cookie,
      // and then split it by semicolon to remove any additional cookie-related information
      return parts.pop().split(';').shift();
    }

    return null; // If there are not two parts, or the cookie with the specified name is not found, return null
  };

  const csrfToken = getCookie('csrftoken');

  // this function converts dates like Mon Jan 1 2024 00:00:00 GMT-0500 (Eastern Standard Time) to 2024-01-01
  // this date will be sent to the backend and is needed because my date field for my model rquires it
  let formatDate = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  // this function converts time like 01:00:00 to 1:00 AM
  // this time was retrieved from the backend and will be converted so that it is more readable for the user
  const convert24to12 = (time) => {
    const formattedTime = new Date(`2000-01-01T${time}`); // random date is used, only time is required
    return formattedTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  // this function converts time like 1:00 AM to 01:00:00
  // this time was provided by the user and will be sent to the backend
  const convert12to24 = (time12h) => {
    let [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
  
    hours = parseInt(hours, 10);
  
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
  
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  // handles date change when the user clicks a day on the calendar component
  let handleDateChange = (newDate) => {
    setDay(newDate);
    getGymSession(newDate);
  };

  // gets and sets the schedule for a gym session for a specfic day
  let getGymSession = useCallback((selectedDate) => {
    let specificDate = formatDate(selectedDate);

    client.get(`api/gymsession/details/${specificDate}`, {})
    .then(function (res) {
      setSchedule(res.data[0])
    })
    .catch(function (error) {
      console.log(error);
    });
  }, [client]);

  // handles submitting a new schedule for a day
  let handleScheduleSubmit = async (e) => {
    e.preventDefault();
    
    client.post("api/gymsession/schedule/", {
        day: e.target.day.value,
        time: convert12to24(e.target.time.value),
        target_muscles: e.target.target_muscles.value
      },
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
      },
    })
    .then(function (res) { // this is so that the modal closes and the view updates when the user submits
      setSchedule({"time": e.target.time.value, "target_muscles": e.target.target_muscles.value});
      toggleScheduleModal()
    })
    .catch(function(error) {
      console.log(error)
    })
  }

  // gets the gym session for the current day everytime the page rerenders
  useEffect(() => {
    getGymSession(day)
  }, [day, getGymSession]);

  return (
    <Box height="100vh" maxW="100%" m="auto" align="center" display={{ base: "block", md: "flex" }}>
        <Navbar />
        <Container maxW={{base:"100%", md:"80%"}} p="4">
          <Heading display={{ base: "none", md: "block" }} fontFamily="heading" fontWeight="bold" fontSize="5xl">Schedule</Heading>
          <Heading display={{ base: "block", md: "none" }} fontFamily="heading" fontWeight="bold" fontSize="4xl">Schedule</Heading>
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
            {/* converts dates like 2024-01-01 to Mon Jan 1 2024 00:00:00 GMT-0500 (Eastern Standard Time) for readibility */}
            {day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                    <Td fontFamily="body" fontWeight="regular" fontSize={{base:"sm", md:"md"}} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>{convert24to12(schedule.time)}</Td>
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
                {/* converts dates like 2024-01-01 to Mon Jan 1 2024 00:00:00 GMT-0500 (Eastern Standard Time) for readibility */}
                <Text fontWeight="medium" fontSize="lg">{day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box>
                  <form onSubmit={handleScheduleSubmit}>
                    <FormControl mb={8}>
                      <Input type='hidden' id="day" value={formatDate(day)} /> {/* note that day input is hidden and automatically given */}
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
        </Container>
    </Box>
  );
};

export default SchedulePage;
