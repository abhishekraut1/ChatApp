import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, useToast } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import axios from 'axios';

const ChatPage = () => {
  const { user, setUserPic } = ChatState();

  const { fetchAgain, setFetchAgain } = ChatState();

  const fetchAllUsers = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`
      }
    }
    const { data } = await axios.get('/api/user/allusers', config);
    const loggedUser = data.filter((u)=> u._id === JSON.parse(localStorage.getItem("userInfo"))._id)
    setUserPic(loggedUser[0].pic)
  }


  useEffect(() => {
    setFetchAgain(!fetchAgain)
    fetchAllUsers()
  }, [])


  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display='flex'
        justifyContent="space-between"
        p="10px"
        h="91.5vh"
        w="100%"
      >
        {user && <MyChats />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default ChatPage
