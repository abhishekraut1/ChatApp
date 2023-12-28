import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';


const ChatPage = () => {
  const {user} = ChatState();
  
  return (
   <div style={{width:"100%"}}>
    {user && <SideDrawer/>}
    <Box
      display='flex'
      justifyContent="space-between"
      p="10px"
      h="91em"
      w="100%"
    >
      {user && <MyChats/>}
      {user && <ChatBox/>}
    </Box>
   </div>
  )
}

export default ChatPage
