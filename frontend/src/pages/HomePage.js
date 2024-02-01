import React, { useContext } from "react";

import AuthContext from "../context/AuthContext";

import { Box, Container, Heading } from "@chakra-ui/react";

import Navbar from "../components/Navbar"

const HomePage = () => {
  let { user } = useContext(AuthContext);

  return (
    <Box height="100vh" maxW="100%" m="auto" align="center" display={{ base: "block", md: "flex" }}>
        <Navbar />
        <Container maxW="80%" p="4">
          <Box>
            <Heading display={{ base: "none", md: "block" }} fontFamily="heading" fontSize="5xl">ᕦ(ˇò_ó)ᕤ Hello {user.username} ᕦ(ò_óˇ)ᕤ</Heading>
            <Heading display={{ base: "block", md: "none" }} fontFamily="heading" fontSize="5xl">Hello {user.username}</Heading>
          </Box>
        </Container>
    </Box>
  );
};

export default HomePage;
