import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

import { Box, Container, Heading, Text, Image, Link} from "@chakra-ui/react";
import {FormControl, FormLabel, Input, Button} from '@chakra-ui/react'

const RegisterPage = () => {
  let { registerUser } = useContext(AuthContext);

  return (
    <Box height="100vh" maxW="100%" m="auto" align="center">
      <Container pt={40} mb={12}>
        <Heading fontFamily="heading" fontWeight="bold" fontSize="5xl" mb={4}>GYM TOGETHER</Heading>
        <Image src="/dumbbell_white.png" alt="Dumbbell Logo" display="inline-block"/>
      </Container>
      <Container>
        <Heading fontFamily="heading" fontWeight="medium" fontSize="xl" mb={8}>Sign In To Your Account</Heading>
        <Box maxW="72">
          <form onSubmit={registerUser}>
            <FormControl mb={8}>
              <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Username</FormLabel>
              <Input type='text' id="username" fontFamily="body" fontWeight="regular" fontSize="md" placeholder="Username"/>
              <br/><br/>
              <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Email Address</FormLabel>
              <Input type='email' id="email" fontFamily="body" fontWeight="regular" fontSize="md" placeholder="Email Address"/>
              <br/><br/>
              <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Password</FormLabel>
              <Input type='password' id="password" placeholder="Password"/>
            </FormControl>
            <Button type="submit" fontFamily="heading" fontWeight="medium" bg="#898DB7" _hover={{ bg: '#51546E' }} color="white" width="100%" mb={4}>
                SIGN UP
            </Button>
          </form>
          <Text fontFamily="heading" fontSize="sm">
            Already Have An Account? {' '}
            <Link href="/login" color="#898DB7">
              Sign In
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  )
};

export default RegisterPage;