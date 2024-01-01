import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/chatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState()

    return (
        <>
            {selectedChat ? (
                <>
                    <Box
                        display='flex'
                        justifyContent={{ base: 'space-between' }}
                        alignItems='center'
                        fontSize={{ base: '28px', md: '30px' }}
                        pb={3}
                        px={2}
                        w='100%'
                        fontFamily='Work Sans'
                    >
                        <IconButton
                            display={{ base: 'flex', md: 'none' }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />

                        {selectedChat.isGroupChat ? (
                            <>{selectedChat.chatName.toUpperCase()}

                            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

                            </>
                        ) : (
                            <> {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        )}

                    </Box>
                    <Box
                        display='flex'
                        flexDir='column'
                        p={3}
                        bg='#E8E8E8'
                        overflowY='hidden'
                        w='100%'
                        h='100%'
                        borderRadius='lg'
                    >
                        {/* Messages Here */}
                    </Box>

                </>
            ) : (
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    h='100%'
                >
                    <Text fontSize='3xl' pb={3} fontFamily='Work Sans' >
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat
