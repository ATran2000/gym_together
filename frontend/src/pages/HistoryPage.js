import React from "react";

import { Box, Container, Heading } from "@chakra-ui/react";

import Navbar from "../components/Navbar"

const HistoryPage = () => {
  return (
    <Box height="100vh" maxW="100%" m="auto" align="center" display={{ base: "block", md: "flex" }}>
        <Navbar />
        <Container maxW={{base:"100%", md:"80%"}} p="4">
          <Heading display={{ base: "none", md: "block" }} fontFamily="heading" fontWeight="bold" fontSize="5xl">History</Heading>
          <Heading display={{ base: "block", md: "none" }} fontFamily="heading" fontWeight="bold" fontSize="4xl">History</Heading>
        </Container>
    </Box>
  );
};

export default HistoryPage;
