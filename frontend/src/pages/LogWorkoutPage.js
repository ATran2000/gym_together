import React, { useContext, useState, useEffect, useCallback } from "react";

import AuthContext from "../context/AuthContext";
import { formatDateBackend } from "../utils/DateTimeUtils"

import { Box, Heading, Button, Text } from "@chakra-ui/react";
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react'

const LogWorkoutPage = () => {
  const { client, csrfToken } = useContext(AuthContext);

  const [workouts, setWorkouts] = useState([])

  const [isOpenAddWorkoutModal, setOpenAddWorkoutModal] = useState(false);

  const toggleAddWorkoutModal = () => {
    setOpenAddWorkoutModal(!isOpenAddWorkoutModal);
  };

  // gets and sets the workouts for today's gym session
  const loadWorkouts = useCallback(async () => {
    try {
      const today = formatDateBackend(new Date());
      const res = await client.get(`api/gymsession/details/${today}`, {});

      if (res.data[0]) {
        setWorkouts(res.data[0].workouts)
      } else {
        setWorkouts([])
      }
    } catch (error) {
      console.log(error);
    }
  }, [client]);

  // handles adding workouts to the exercise log
  const addWorkout = async (e) => {
    e.preventDefault()

    try {
      await client.post("api/gymsession/addworkout/", {
        exercise: e.target.exercise.value,
        weight: e.target.weight.value,
        reps: e.target.reps.value,
      }, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
  
      // updates the view and closes the modal after successful submit
      await loadWorkouts();
      toggleAddWorkoutModal();
    } catch (error) {
      console.log(error);
    }
  }

  // loads the workouts for the current day everytime the page rerenders
  useEffect(() => {
    loadWorkouts()
  }, [loadWorkouts]);

  return (
    <Box>
      <Heading fontFamily="heading" fontWeight="bold" fontSize={{ base: "4xl", md: "5xl" }}>Log Workout</Heading>
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
    </Box>
  );
};

export default LogWorkoutPage;
