import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import { Box, Container } from "@chakra-ui/react";

import Navbar from "../components/Navbar";

const PrivateRoutes = () => {
  const { user } = useContext(AuthContext);
  
  return (
    user ? ( 
      <Box height="100vh" maxW="100%" m="auto" align="center" display={{ base: "block", md: "flex" }}>
        <Navbar />
        <Container maxW={{base:"100%", md:"80%"}} p="4">
          <Outlet/>
        </Container>
      </Box>
    ) : (
      <Navigate to="/login" />
    )
  );
};

export default PrivateRoutes;