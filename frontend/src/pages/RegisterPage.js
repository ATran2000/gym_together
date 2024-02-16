import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import { Box, Container, Heading, Text, Image } from "@chakra-ui/react";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

const RegisterPage = () => {
  let { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // using states for credentials for validation purposes
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const isButtonDisabled =
    !username ||
    !email ||
    !password ||
    !confirmPassword ||
    !!usernameError ||
    !!emailError ||
    !!passwordError ||
    !!confirmPasswordError;

  // resets username error back to "" on username input change
  // this case is needed if a username is already taken and the error message pops up
  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setUsername(value);
    setUsernameError("");
  };

  const validateEmail = (email) => {
    // regular expression for validating email format
    // emails should be in the format: example@email.com
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);

    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else if (value !== confirmPassword && confirmPassword.length) {
      // the user matched confirmation password, but decides to change password field after
      // doesn't validate confirmation password if the user didnt add any input for it yet
      setPasswordError("");  // reset password error if the user ends up changing the password and going under 8 characters
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setPasswordError("");
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);

    if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      await registerUser(username, email, password);
      navigate("/");
    } catch (error) {
      if (error.response.data.username) {
        setUsernameError("This username is already taken.");
      }
      if (error.response.data.email) {
        setEmailError("Account with this email already exists.");
      }
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
          <form onSubmit={handleRegister} noValidate>
            <FormControl mb={8}>
              <Box mb={6}>
                <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Username</FormLabel>
                <Input
                  type="text"
                  id="username"
                  fontFamily="body"
                  fontWeight="regular"
                  fontSize="md"
                  placeholder="Username"
                  onChange={handleUsernameChange}
                  borderColor={usernameError ? "yellow" : "inherit"}
                  focusBorderColor={usernameError ? "#FFFF00" : "white"}  // using hex for yellow because 'yellow' doesn't work
                  _hover="inherit"
                />
                <Text color="yellow" fontFamily="body" fontWeight="regular" fontSize="sm" position="absolute" mt={0.5}>
                  {usernameError}
                </Text>
              </Box>
              <Box mb={6}>
                <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Email Address</FormLabel>
                <Input
                  type="email"
                  id="email"
                  fontFamily="body"
                  fontWeight="regular"
                  fontSize="md"
                  placeholder="Email Address"
                  onChange={handleEmailChange}
                  borderColor={emailError ? "yellow" : "inherit"}
                  focusBorderColor={emailError ? "#FFFF00" : "white"}  // using hex for yellow because 'yellow' doesn't work
                  _hover="inherit"
                />
                <Text color="yellow" fontFamily="body" fontWeight="regular" fontSize="sm" position="absolute" mt={0.5}>
                  {emailError}
                </Text>
              </Box>
              <Box mb={6}>
                <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Password</FormLabel>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  borderColor={passwordError ? "yellow" : "inherit"}
                  focusBorderColor={passwordError ? "#FFFF00" : "white"}  // using hex for yellow because 'yellow' doesn't work
                  _hover="inherit"
                />
                <Text color="yellow" fontFamily="body" fontWeight="regular" fontSize="sm" position="absolute" mt={0.5}>
                  {passwordError}
                </Text>
              </Box>
              <Box mb={6}>
                <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Comfirm Password</FormLabel>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleConfirmPasswordChange}
                  borderColor={confirmPasswordError ? "yellow" : "inherit"}
                  focusBorderColor={confirmPasswordError ? "#FFFF00" : "white"}  // using hex for yellow because 'yellow' doesn't work
                  _hover="inherit"
                />
                <Text color="yellow" fontFamily="body" fontWeight="regular" fontSize="sm" position="absolute" mt={0.5}>
                  {confirmPasswordError}
                </Text>
              </Box>
            </FormControl>
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
              SIGN UP
            </Button>
          </form>
          <Text fontFamily="heading" fontSize="sm">
            Already Have An Account?{" "}
            <Link to="/login">
              <Text as="span" color="#898DB7" _hover={{ textDecoration: "underline" }}>
                Sign In
              </Text>
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
