import React, { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import { Box, Container, Heading, Button, Text } from "@chakra-ui/react";
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

import Navbar from "../components/Navbar"

const HomePage = () => {
  let { user, userFriends } = useContext(AuthContext);

  return (
    <Box height="100vh" maxW="100%" m="auto" align="center" display={{ base: "block", md: "flex" }}>
        <Navbar />
        <Container maxW={{base:"100%", md:"80%"}} p="4">
          <Heading display={{ base: "none", md: "block" }} fontFamily="heading" fontWeight="bold" fontSize="5xl">ᕦ(ˇò_ó)ᕤ Hello {user.username} ᕦ(ò_óˇ)ᕤ</Heading>
          <Heading display={{ base: "block", md: "none" }} fontFamily="heading" fontWeight="bold" fontSize="4xl">Hello {user.username}</Heading>
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
              {userFriends && userFriends.length > 0 ? (
                userFriends.map((friend) => (
                  <Tr key={friend.id}>
                    <Td fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>{friend.username}</Td>
                    <Td fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>7:00pm</Td>
                    <Td fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>Chest/Triceps</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={3} fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>None</Td>
                </Tr>
              )}
              </Tbody>
            </Table>
          </TableContainer>
        </Container>
    </Box>
  );
};

export default HomePage;
