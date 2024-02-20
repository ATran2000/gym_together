import React, { useContext, useState, useEffect } from "react";

import AuthContext from "../context/AuthContext";

import { Box, Heading, Button, Text } from "@chakra-ui/react";
import { Table, TableContainer, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react'

const FriendsPage = () => {
  let { client, userFriends, setUserFriends } = useContext(AuthContext);

  let [FriendRequests, setFriendRequests] = useState([])
  let [FriendRequestsCount, setFriendRequestsCount] = useState(null)

  let [isOpenAddFriendModal, setOpenAddFriendModal] = useState(false);
  let [isOpenFriendRequestModal, setOpenFriendRequestModal] = useState(false);

  let toggleAddFriendModal = () => {
    setOpenAddFriendModal(!isOpenAddFriendModal);
  };

  let toggleFriendRequestModal = () => {
    setOpenFriendRequestModal(!isOpenFriendRequestModal);
  };

  // function that will be used to get the csrftoken cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;  // Get the entire cookie string from the document
    const parts = value.split(`; ${name}=`);  // Split the cookie string into an array of substrings, using the provided cookie name as the delimiter

    if (parts.length === 2) {  // Check if there are two parts in the array
      // If there are two parts, pop the last element, which contains the value of the cookie,
      // and then split it by semicolon to remove any additional cookie-related information
      return parts.pop().split(';').shift();
    }

    return null; // If there are not two parts, or the cookie with the specified name is not found, return null
  };

  const csrfToken = getCookie('csrftoken');

  // handles sending friend requests to other users
  let sendFriendRequest = async (e) => {
    e.preventDefault()

    client.post("api/user/send_friend_request/", {
        receiver_username: e.target.username.value
      },
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
      },
    })
    .then(function (res) { // this is so that the modal closes when the user submits
      toggleAddFriendModal()
    })
    .catch(function(error) {
      console.log(error)
    })
  }

  // handles accepting friend requests
  let handleAccept = (friendRequestId) => {
    client.post(`api/user/accept_friend_request/${friendRequestId}/`, null, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
    .then(function(res) {
      // Remove the accepted friend request from the state and update num friend request
      setFriendRequests(prevFriendRequests => prevFriendRequests.filter(FriendRequest => FriendRequest.id !== friendRequestId));
      setFriendRequestsCount(prevCount => prevCount - 1);
      
      // Create new instance of accepted friend
      let newFriend = res.data.sender;

      // Update the friends state with the newly accepted friend
      setUserFriends(prevFriends => [...prevFriends, newFriend]);
    })
    .catch(function(error) {
      console.log(error)
    });
  };
  
  // handles removing friend requests
  let handleRemove = (friendRequestId) => {
    client.post(`api/user/remove_friend_request/${friendRequestId}/`, null, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
    .then(function(res) {
      console.log(res);

      // Remove the removed friend request from the state and update num friend request
      setFriendRequests(prevFriendRequests => prevFriendRequests.filter(FriendRequest => FriendRequest.id !== friendRequestId));
      setFriendRequestsCount(prevCount => prevCount - 1);
    })
    .catch(function(error) {
      console.log(error)
    });
  };

  // gets and sets the user's existing friend requests and the count of them
  useEffect(() => {
    let getFriendRequests = () => {
      client.get("api/user/friend_requests/", {
      })
      .then(function(res) {
        let friendRequests = res.data
        let numFriendRequests = friendRequests.length

        setFriendRequests(friendRequests)
        setFriendRequestsCount(numFriendRequests)
      })
      .catch(function(error) {
        console.log(error)
      })
    }

    getFriendRequests()
  }, [client]);

  return (
    <Box>
      <Heading display={{ base: "none", md: "block" }} fontFamily="heading" fontWeight="bold" fontSize="5xl">Friends</Heading>
      <Heading display={{ base: "block", md: "none" }} fontFamily="heading" fontWeight="bold" fontSize="4xl">Friends</Heading>
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
                <Button onClick={() => handleAccept(FriendRequest.id)} width="20" fontFamily="body" fontWeight="medium" bg="#898DB7" _hover={{ bg: '#51546E' }} color="white" ml="4">Accept</Button>
                <Button onClick={() => handleRemove(FriendRequest.id)} width="20" fontFamily="body" fontWeight="medium" bg="#2D2D39" _hover={{ bg: '#51546E' }} color="white" ml="4">Remove</Button>
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FriendsPage;
