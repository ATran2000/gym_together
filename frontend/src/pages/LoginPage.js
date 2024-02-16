import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import { Box, Container, Heading, Text, Image } from "@chakra-ui/react";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const isButtonDisabled = !email || !password;

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");  // resets the login error message

    try {
      await loginUser(email, password);
      navigate("/");  // navigate to home page after successful login
    } catch (error) {
      setLoginError(error.message);  // displays an error message if the credentials for login is incorrect
    }
  };

  return (
    <Box height="100vh" maxW="100%" m="auto" align="center">
      <Container pt={32} mb={8}>
        <Heading fontFamily="heading" fontWeight="bold" fontSize="5xl" mb={4}>
          GYM TOGETHER
        </Heading>
        <Image src="/dumbbell_white.png" alt="Dumbbell Logo" />
      </Container>
      <Container>
        <Heading fontFamily="heading" fontWeight="medium" fontSize="xl" mb={8}>
          Sign In To Your Account
        </Heading>
        <Box maxW="72">
          <form onSubmit={handleLogin} noValidate>
            <FormControl mb={8}>
              <Box mb={6}>
                <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Email Address</FormLabel>
                <Input
                  type="email"
                  id="email"
                  fontFamily="body"
                  fontWeight="regular"
                  fontSize="md"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  borderColor={loginError ? "yellow" : "inherit"}
                  focusBorderColor={loginError ? "#FFFF00" : "white"}  // using hex for yellow because 'yellow' doesn't work
                  _hover="inherit"
                />
              </Box>
              <Box mb={6}>
                <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Password</FormLabel>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  borderColor={loginError ? "yellow" : "inherit"}
                  focusBorderColor={loginError ? "#FFFF00" : "white"}  // using hex for yellow because 'yellow' doesn't work
                  _hover="inherit"
                />
              </Box>
            </FormControl>
            {loginError && (
              <Text color="yellow" fontFamily="body" fontWeight="regular" fontSize="sm" mb={8}>
                {loginError}
              </Text>
            )}
            <Button
              type="submit"
              fontFamily="heading"
              fontWeight="medium"
              bg="#898DB7"
              _hover={!isButtonDisabled && { bg: "#51546E" }}
              color="white"
              width="100%"
              mb={4}
              isDisabled={isButtonDisabled}
            >
              SIGN IN
            </Button>
          </form>
          <Text fontFamily="heading" fontSize="sm">
            Not A Member?{" "}
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
