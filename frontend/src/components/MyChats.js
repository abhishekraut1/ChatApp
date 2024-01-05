import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { useToast, Box, Button, Stack, Text, Avatar } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading'
import { getSender, getSenderFull } from '../config/chatLogics';
import GroupModal from '../components/miscellaneous/GroupModal'

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState()
  const { selectedChat, setSelectedChat, user, chats, setChats, fetchAgain } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get("/api/chat", config);
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error occurred!',
        // description: 'Failed to load chats',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left'
      });
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain])

  // console.log(selectedChat)


  return (
    <Box
      display={{ base: selectedChat ? "none" : 'flex', md: 'flex' }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      width={{ base: '100%', md: '31%' }}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '25px',md:'20px', xl:'28px' }}
        fontFamily='Work Sans'
        display='flex'
        width='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        My Chats

        <GroupModal>
          <Button
            display='flex'
            fontSize={{ base: '17px', md: '14px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >

            Create Group
          </Button>
        </GroupModal>

      </Box>
      <Box
        display='flex'
        flexDir='column'
        p={3}
        bg='#F8F8F8'
        w='100%'
        height='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {
          chats ? (
            <Stack overflowY='scroll'>
              {chats.map((chat) => (
                <Box key={chat._id} display='flex' >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name = {getSender(loggedUser, chat.users) ? getSender(loggedUser, chat.users) : ""}
                  src={getSenderFull(loggedUser, chat.users).pic ? getSenderFull(loggedUser, chat.users).pic: ""}
                  />
                  
                  <Box
                    onClick={() => {setSelectedChat(chat)}}
                    cursor='pointer'
                    bg={selectedChat === chat ? '#38B2AC' : "E8E8E8"}
                    color={selectedChat === chat ? 'white' : "black"}
                    px={3}
                    py={2}
                    borderRadius='lg'
                    w='100%'
                  >
                    <Text>
                      {!chat.isGroupChat ? (
                        getSender(loggedUser, chat.users)
                      ) : (
                        chat.chatName
                      )}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )
        }
      </Box>
    </Box>
  )
}

export default MyChats
