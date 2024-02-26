import React, { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import { formatTime24To12 } from "../utils/DateTimeUtils"

import { Box, Heading, Button, Text } from "@chakra-ui/react";
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const HomePage = () => {
  let { user, userFriends } = useContext(AuthContext);

  let anyFriendsGymingToday = false

  if (userFriends) {
    userFriends.forEach((friend) => {
      if (friend.gym_session_today.length > 0) {
        anyFriendsGymingToday = true;
      }
    });
  }

  return (
    <Box>
      <Heading fontFamily="heading" fontWeight="bold" fontSize={{ base: "4xl", md: "5xl" }}>Hello {user.username}</Heading>
      <Link to="/logworkout">
        <Button width={{base:"80%", md:"60"}} fontFamily="heading" fontWeight="semibold" fontSize="2xl" bg="#898DB7" _hover={{ bg: '#51546E' }} color="white" m={8}>
            Log Today's Workout
        </Button>
      </Link>
      <Text fontFamily="heading" fontWeight="semibold" fontSize="2xl">
        Friends Gyming Today
      </Text>
      <TableContainer width="100%">
        <Table variant='simple' __css={{'tableLayout': 'fixed', width: 'full'}} borderWidth={2} borderColor={"#2D2D39"}>
          <Thead>
            <Tr bg="#898DB7">
              <Th fontFamily="heading" fontWeight="medium" fontSize="lg" textAlign="center" color="white" borderWidth={1} borderColor={"#2D2D39"}>Friends</Th>
              <Th fontFamily="heading" fontWeight="medium" fontSize="lg" textAlign="center" color="white" borderWidth={1} borderColor={"#2D2D39"}>Time</Th>
              <Th fontFamily="heading" fontWeight="medium" fontSize="lg" textAlign="center" color="white" borderWidth={1} borderColor={"#2D2D39"}>Muscles</Th>
            </Tr>
          </Thead>
          <Tbody bg="#51546E">
            {/* display the friends who are gyming today if you have friends and if at least one friend is gyming today */}
          {userFriends && userFriends.length > 0 && anyFriendsGymingToday ? (
            userFriends.map((friend) => (
              friend.gym_session_today.length > 0 ? (
                <Tr key={friend.id}>
                  <Td fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"} whiteSpace="normal">{friend.username}</Td>
                  <Td fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>{formatTime24To12(friend.gym_session_today[0].time)}</Td>
                  <Td fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"} whiteSpace="normal">{friend.gym_session_today[0].target_muscles}</Td>
                </Tr>
              ) : null  
            ))
          ) : (
            <Tr>
              <Td colSpan={3} fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>None</Td>
            </Tr>
          )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HomePage;
