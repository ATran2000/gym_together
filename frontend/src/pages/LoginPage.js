import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import { Box, Container, Heading, Text, Image} from "@chakra-ui/react";
import {FormControl, FormLabel, Input, Button} from '@chakra-ui/react'

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")

  let isButtonDisabled = email === "" || password === ""

  const handleLogin = (event) => {
    event.preventDefault();
    
    if (!isButtonDisabled) {
      loginUser(event);
    }
  };

  return (
    <Box height="100vh" maxW="100%" m="auto" align="center">
      <Container pt={40} mb={12}>
        <Heading fontFamily="heading" fontWeight="bold" fontSize="5xl" mb={4}>GYM TOGETHER</Heading>
        <Image src="/dumbbell_white.png" alt="Dumbbell Logo" />
      </Container>
      
      <Container>
        <Heading fontFamily="heading" fontWeight="medium" fontSize="xl" mb={8}>Sign In To Your Account</Heading>
        <Box maxW="72">
          <form onSubmit={handleLogin}>
            <FormControl mb={8}>
              <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Email Address</FormLabel>
              <Input type='email' id="email" fontFamily="body" fontWeight="regular" fontSize="md" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <br/><br/>
              <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Password</FormLabel>
              <Input type='password' id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </FormControl>
            <Button 
              type="submit" 
              fontFamily="heading" 
              fontWeight="medium" 
              bg="#898DB7" 
              _hover={!isButtonDisabled && { bg: '#51546E' }} 
              color="white" width="100%" 
              mb={4} 
              isDisabled={isButtonDisabled}
            >
              SIGN IN
            </Button>
          </form>
          <Text fontFamily="heading" fontSize="sm">
            Not A Member? {' '}
            <Link to="/register">
              <Text as="span" color="#898DB7" _hover={{ textDecoration: "underline" }}>
                Sign Up
              </Text>
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
