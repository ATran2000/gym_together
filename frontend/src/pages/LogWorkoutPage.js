import React from "react";

import { Box, Container, Heading } from "@chakra-ui/react";

import Navbar from "../components/Navbar"

const LogWorkoutPage = () => {
  return (
    <Box height="100vh" maxW="100%" m="auto" align="center" display={{ base: "block", md: "flex" }}>
        <Navbar />
        <Container maxW="80%" p="4">
          <Heading fontFamily="heading" fontSize="5xl">Log Workout Page!</Heading>
        </Container>
    </Box>
  );
};

export default LogWorkoutPage;
