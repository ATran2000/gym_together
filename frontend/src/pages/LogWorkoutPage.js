import React, { useContext, useState, useEffect, useCallback } from "react";

import AuthContext from "../context/AuthContext";

import { Box, Container, Heading, Button, Text } from "@chakra-ui/react";
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react'

import Navbar from "../components/Navbar"

const LogWorkoutPage = () => {
  let { client } = useContext(AuthContext);

  let [workouts, setWorkouts] = useState([])

  let [isOpenAddWorkoutModal, setOpenAddWorkoutModal] = useState(false);

  let toggleAddWorkoutModal = () => {
    setOpenAddWorkoutModal(!isOpenAddWorkoutModal);
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

  // gets and sets the workouts for today's gym session
  let getGymSession = useCallback(() => {
    let today = formatDate(new Date());

    client.get(`api/gymsession/details/${today}`, {})
    .then(function (res) {
      if (res.data[0]) {
        setWorkouts(res.data[0].workouts)
      } else {
        setWorkouts([])
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }, [client]);

  // handles adding workouts to the exercise log
  let addWorkout = async (e) => {
    e.preventDefault()

    client.post("api/gymsession/addworkout/", {
        exercise: e.target.exercise.value,
        weight: e.target.weight.value,
        reps: e.target.reps.value,
      },
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
      },
    })
    .then(function (res) { // this is so that the modal closes and the view updates when the user submits
      getGymSession();
      toggleAddWorkoutModal()
    })
    .catch(function(error) {
      console.log(error)
    })
  }

  // gets the gym session for the current day everytime the page rerenders
  useEffect(() => {
    getGymSession()
  }, [getGymSession]);

  return (
    <Box height="100vh" maxW="100%" m="auto" align="center" display={{ base: "block", md: "flex" }}>
        <Navbar />
        <Container maxW={{base:"100%", md:"80%"}} p="4">
          <Heading display={{ base: "none", md: "block" }} fontFamily="heading" fontWeight="bold" fontSize="5xl">Log Workout</Heading>
          <Heading display={{ base: "block", md: "none" }} fontFamily="heading" fontWeight="bold" fontSize="4xl">Log Workout</Heading>
          <Button onClick={toggleAddWorkoutModal} width={{base:"80%", md:"60"}} fontFamily="heading" fontWeight="semibold" fontSize="2xl" bg="#898DB7" _hover={{ bg: '#51546E' }} color="white" m={8}>
              Add Exercise
          </Button>
          <Text fontFamily="heading" fontWeight="semibold" fontSize="2xl">
            Exercise Log
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
                {workouts && workouts.length > 0 ? ( 
                  workouts.map((workout) => (
                    <Tr key={workout.id}>
                      <Td fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"} whiteSpace="normal">{workout.exercise}</Td>
                      <Td fontFamily="body" fontWeight="regular" fontSize={{base:"sm", md:"md"}} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>{workout.weight} lbs</Td>
                      <Td fontFamily="body" fontWeight="regular" fontSize={{base:"sm", md:"md"}} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>{workout.reps}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3} fontFamily="body" fontWeight="regular" fontSize={{base:"sm", md:"md"}} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>Add to your exercise log!</Td>
                  </Tr>
                )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          {/* popup modal for scheduling gym sessions */}
          <Modal isOpen={isOpenAddWorkoutModal} onClose={toggleAddWorkoutModal} size={{base:"sm", md:"md"}}>
            <ModalOverlay />
            <ModalContent bg="#51546E">
              <ModalHeader fontFamily="heading" fontWeight="semibold" fontSize="2xl">
                Add Exercise
                <Text fontWeight="medium" fontSize="lg">Input Details Of Your Set</Text>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box>
                  <form onSubmit={addWorkout}>
                    <FormControl mb={8}>
                      <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Exercise</FormLabel>
                      <Input type='text' id="exercise" fontFamily="body" fontWeight="regular" fontSize="md" placeholder="Exercise" />
                      <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md" mt="4">Weight</FormLabel>
                      <Input type='number' id="weight" fontFamily="body" fontWeight="regular" fontSize="md" placeholder="Weight" />
                      <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md" mt="4">Reps</FormLabel>
                      <Input type='number' id="reps" fontFamily="body" fontWeight="regular" fontSize="md" placeholder="Reps" />
                    </FormControl>
                    <Button type="submit" fontFamily="heading" fontWeight="medium" bg="#898DB7" _hover={{ bg: '#51546E' }} color="white" width="100%" mb={4}>
                        Add Exercise
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

export default LogWorkoutPage;
