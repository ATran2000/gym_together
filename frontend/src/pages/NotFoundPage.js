import React, { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import { Box, Container, Heading, Button } from "@chakra-ui/react";

import Navbar from "../components/Navbar";

const NotFoundPage = () => {
    const { user } = useContext(AuthContext);
    const returnButtonText = user ? "Home" : "Login";

    return (
    <Box height="100vh" maxW="100%" m="auto" align="center" display={{ base: "block", md: "flex" }}>
        {user && <Navbar />}
        <Container maxW={{base:"100%", md:"80%"}} p="4">
            <Heading fontFamily="heading" fontWeight="bold" fontSize={{ base: "4xl", md: "5xl" }} display="block" textAlign="center">
                Page Not Found
            </Heading>
            <Box>
                <Link to={user ? "/" : "/login"}>
                    <Button width={{base:"80%", md:"60"}} fontFamily="heading" fontWeight="semibold" fontSize="2xl" bg="#898DB7" _hover={{ bg: '#51546E' }} color="white" m={8}>
                        Return to {returnButtonText}
                    </Button>
                </Link>
            </Box>
        </Container>
      </Box>
    );
  };

export default NotFoundPage;
