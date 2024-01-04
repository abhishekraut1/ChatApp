import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box
    bg='purple'
    px={2}
    py={1}
    m={1}
    mb={2}
    fontSize={12}
    borderRadius='lg'
    color='white'
    cursor='pointer'
    onClick={handleFunction}

    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  )
}

export default UserBadgeItem
