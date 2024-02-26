import React, { useContext, useState, useEffect } from "react";

import AuthContext from "../context/AuthContext";

import { Box, Heading, Button, Text } from "@chakra-ui/react";
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

const FriendsPage = () => {
  const { client, userFriends, setUserFriends, csrfToken } = useContext(AuthContext);

  const [FriendRequests, setFriendRequests] = useState([])
  const [FriendRequestsCount, setFriendRequestsCount] = useState(null)

  const [isOpenAddFriendModal, setOpenAddFriendModal] = useState(false);
  const [isOpenFriendRequestModal, setOpenFriendRequestModal] = useState(false);

  const toggleAddFriendModal = () => {
    setOpenAddFriendModal(!isOpenAddFriendModal);
  };

  const toggleFriendRequestModal = () => {
    setOpenFriendRequestModal(!isOpenFriendRequestModal);
  };

  // handles sending friend requests to other users
  const sendFriendRequest = async (e) => {
    e.preventDefault();
  
    try {
      await client.post("api/user/send_friend_request/", {
        receiver_username: e.target.username.value
      }, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });

      toggleAddFriendModal();  // closes the modal when the user submits
    } catch (error) {
      console.log(error);
    }
  };

  // handles accepting friend requests
  const handleAccept = async (FriendRequest) => {
    try {
      await client.post(`api/user/accept_friend_request/${FriendRequest.id}/`, null, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
  
      // removes the accepted friend request from the state and update num friend requests
      setFriendRequests(FriendRequests => FriendRequests.filter(FriendRequestItem => FriendRequestItem.id !== FriendRequest.id));
      setFriendRequestsCount(prevCount => prevCount - 1);
  
      // updates the friends state with the newly accepted friend
      setUserFriends(prevFriends => [...prevFriends, FriendRequest.sender]);
    } catch (error) {
      console.log(error);
    }
  };

  // handles removing friend requests
  const handleRemove = async (FriendRequest) => {
    try {
      await client.post(`api/user/remove_friend_request/${FriendRequest.id}/`, null, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });

      // removes the removed friend request from the state and update num friend requests
      setFriendRequests(FriendRequests => FriendRequests.filter(FriendRequestItem => FriendRequestItem.id !== FriendRequest.id));
      setFriendRequestsCount(prevCount => prevCount - 1);
    } catch (error) {
      console.log(error);
    }
  };

  // gets and sets the user's existing friend requests and the count of them
  useEffect(() => {
    const getFriendRequests = async () => {
      try {
        const res = await client.get("api/user/friend_requests/", {});

        let friendRequests = res.data;
        setFriendRequests(friendRequests);
        setFriendRequestsCount(friendRequests.length);
      } catch (error) {
        console.log(error);
      }
    };

    getFriendRequests();
  }, [client]);

  return (
    <Box>
      <Heading fontFamily="heading" fontWeight="bold" fontSize={{ base: "4xl", md: "5xl" }}>Friends</Heading>
      <Button onClick={toggleAddFriendModal} width={{base:"80%", md:"60"}} fontFamily="heading" fontWeight="semibold" fontSize="2xl" bg="#898DB7" _hover={{ bg: '#51546E' }} color="white" m={8}>
          Add Friends
      </Button>
      <Text fontFamily="heading" fontWeight="semibold" fontSize="2xl">
        Friendlist
      </Text>
      <Box>
        <TableContainer width="100%">
          <Table variant='simple' __css={{'tableLayout': 'fixed', width: 'full'}} borderWidth={2} borderColor={"#2D2D39"}>
            <Thead>
              <Tr bg="#898DB7">
                <Th fontFamily="heading" fontWeight="medium" fontSize="lg" textAlign="center" color="white" borderWidth={1} borderColor={"#2D2D39"}>Friends</Th>
              </Tr>
            </Thead>
            <Tbody bg="#51546E">
            {userFriends && userFriends.length > 0 ? (
              userFriends.map((friend) => (
                <Tr key={friend.id}>
                  <Td fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>{friend.username}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td fontFamily="body" fontWeight="regular" fontSize={{ base: "sm", md: "md" }} textAlign="center" borderWidth={1} borderColor={"#2D2D39"}>No friends available. <br/> Feel free to add the creator of this website! (alvin)</Td>
              </Tr>
            )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Button onClick={toggleFriendRequestModal} fontFamily="heading" fontWeight="medium" fontSize="md" bg="#2D2D39" _hover={{ bg: "#2D2D39", textDecoration: "underline", color: "#898DB7" }} color="white" mt="4">
        Friend Requests ({FriendRequestsCount})
      </Button>

      {/* popup modal for adding friends */}
      <Modal isOpen={isOpenAddFriendModal} onClose={toggleAddFriendModal} size={{base:"sm", md:"md"}}>
        <ModalOverlay />
        <ModalContent bg="#51546E">
          <ModalHeader fontFamily="heading" fontWeight="semibold" fontSize="2xl">
            Want To Add A Friend?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <form onSubmit={sendFriendRequest}>
                <FormControl mb={8}>
                  <FormLabel fontFamily="heading" fontWeight="medium" fontSize="md">Input your friend's username:</FormLabel>
                  <Input type='text' id="username" fontFamily="body" fontWeight="regular" fontSize="md" placeholder="Username"/>
                </FormControl>
                <Button type="submit" fontFamily="heading" fontWeight="medium" bg="#898DB7" _hover={{ bg: '#51546E' }} color="white" width="100%" mb={4}>
                    Send Friend Request
                </Button>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      
      {/* popup modal for accepting or removing friend requests */}
      <Modal isOpen={isOpenFriendRequestModal} onClose={toggleFriendRequestModal} size={{base:"sm", md:"md"}} centered>
        <ModalOverlay />
        <ModalContent bg="#51546E">
          <ModalHeader fontFamily="heading" fontWeight="semibold" fontSize="2xl" align="center">
            Friend Requests ({FriendRequestsCount})
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {FriendRequests.map((FriendRequest) => (
              <Box key={FriendRequest.id} p="4" display="flex">
                <Text fontFamily="body" fontWeight="regular" m="auto">
                  {FriendRequest.sender.username}
                </Text>
                <Button onClick={() => handleAccept(FriendRequest)} width="20" fontFamily="body" fontWeight="medium" bg="#898DB7" _hover={{ bg: '#51546E' }} color="white" ml="4">Accept</Button>
                <Button onClick={() => handleRemove(FriendRequest)} width="20" fontFamily="body" fontWeight="medium" bg="#2D2D39" _hover={{ bg: '#51546E' }} color="white" ml="4">Remove</Button>
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FriendsPage;