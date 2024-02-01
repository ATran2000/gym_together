import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

import { Box, Heading, Link} from "@chakra-ui/react";

const HomePage = () => {
  let { user, logoutUser } = useContext(AuthContext);

  return (
    <Box height="100vh" maxW="100%" m="auto" align="center">
      <Heading fontFamily="heading" fontSize="5xl">Welcome {user.username}!</Heading>
        <Link onClick={logoutUser} color="#898DB7" fontFamily="heading">
            Logout
        </Link>
    </Box>
  );
};

export default HomePage;
