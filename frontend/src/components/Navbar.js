import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import { Box, Text, Flex, Heading, Image, IconButton, Stack } from "@chakra-ui/react";
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody } from "@chakra-ui/react";

import { HamburgerIcon } from "@chakra-ui/icons";

const Navbar = () => {
    let { logoutUser } = useContext(AuthContext);

    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDrawer = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <Box bg={{base:"none", md: "#51546E"}} width={{base:"none", md: "25%"}} p="4">
        <Box display={{ base: "none", md: "block" }}>
          <Box mb="4">
            <Link to="/">
              <Heading fontFamily="heading" fontSize={{ base: "2xl", xl: "5xl" }} fontWeight="bold" mb="4" whiteSpace="nowrap">GYM TOGETHER</Heading>
            </Link>
            <Image src="/dumbbell_white.png" alt="Dumbbell Logo" boxSize={{ base: "50px", xl: "76px" }} />
          </Box>
          <Box pb="24">
            <Stack fontFamily="heading" fontSize={{ base: "lg", xl: "2xl" }} fontWeight="medium" textAlign="left" direction="column" spacing={4} pl="8" whiteSpace="nowrap">
              <Link to="/">
                <Text _hover={{ textDecoration: "underline", color: "#898DB7" }}>
                  HOME
                </Text>
              </Link>
              <Link to="/friends">
                <Text _hover={{ textDecoration: "underline", color: "#898DB7" }}>
                  FRIENDS
                </Text>
              </Link>
              <Link to="/schedule">
                <Text _hover={{ textDecoration: "underline", color: "#898DB7" }}>
                  SCHEDULE
                </Text>
              </Link>
              <Link to="/logworkout">
                <Text _hover={{ textDecoration: "underline", color: "#898DB7" }}>
                  LOG WORKOUT
                </Text>
              </Link>
              <Link to="/history">
                <Text _hover={{ textDecoration: "underline", color: "#898DB7" }}>
                  HISTORY
                </Text>
              </Link>
            </Stack>
          </Box>
          <Box mt={96}>
            <Link onClick={logoutUser}>
                <Text fontFamily="heading" fontSize="xl" _hover={{ textDecoration: "underline", color: "#898DB7" }}>
                  LOGOUT
                </Text>
            </Link>
          </Box>
        </Box>

        {/* HamburgerIcon and Drawer Component for Mobile View */}
        <Flex>
          <IconButton
            icon={<HamburgerIcon />}
            size="lg"
            variant="outline"
            onClick={toggleDrawer}
            display={{ md: "none" }}
            color="white"
          />
        </Flex>
        <Drawer placement="left" onClose={toggleDrawer} isOpen={isOpen} >
          <DrawerOverlay >
            <DrawerCloseButton />
            <DrawerContent bg="#51546E" align="center">
              <Link to="/" onClick={toggleDrawer}>
                <DrawerHeader fontFamily="heading" fontWeight="bold" fontSize="40">GYM TOGETHER</DrawerHeader>
              </Link>
              <Image src="/dumbbell_white.png" alt="Dumbbell Logo" boxSize="16" m="auto" mb="2"/>
              <DrawerBody>
                <Box pb="16">
                  <Stack fontFamily="heading" fontSize="2xl" fontWeight="medium" textAlign="left" direction="column" spacing={4} pl="3">
                    <Link to="/" onClick={toggleDrawer}>
                      <Text>
                        HOME
                      </Text>
                    </Link>
                    <Link to="/friends" onClick={toggleDrawer}>
                      <Text>
                        FRIENDS
                      </Text>
                    </Link>
                    <Link to="/schedule" onClick={toggleDrawer}>
                      <Text>
                        SCHEDULE
                      </Text>
                    </Link>
                    <Link to="/logworkout" onClick={toggleDrawer}>
                      <Text>
                        LOG WORKOUT
                      </Text>
                    </Link>
                    <Link to="/history" onClick={toggleDrawer}>
                      <Text>
                        HISTORY
                      </Text>
                    </Link>
                  </Stack>
                </Box>
                <Box mt="96">
                  <Link onClick={logoutUser}>
                      <Text fontFamily="heading" fontSize="xl" _hover={{ textDecoration: "underline", color: "#898DB7" }}>
                        LOGOUT
                      </Text>
                  </Link>
                </Box>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </Box>
    );
  };

export default Navbar;
