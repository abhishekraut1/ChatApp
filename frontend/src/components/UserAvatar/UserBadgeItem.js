import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'

const UserBadgeItem = ({ user, handleFunction }) => {
  const { selectedChat } = ChatState()
  return (
    <Box
      style={selectedChat && (selectedChat.groupAdmin._id !== user._id) ?{
        borderWidth: '2px', backgroundColor: 'white', color:'#0e61a1' , borderColor: '#0e61a1'
      } : {backgroundColor: '#0e61a1'}}
      px={2}
      py={1}
      m={1}
      mb={2}
      fontSize={14}
      borderRadius='lg'
      color='white'
      cursor='pointer'
      onClick={handleFunction}

    >
      {user ? user.name : ""}
      <CloseIcon pl={1} />
    </Box>
  )
}

export default UserBadgeItem
