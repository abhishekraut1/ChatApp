import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/chatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMassage, setNewMassage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)

    const { user, selectedChat, setSelectedChat } = ChatState()

    const toast = useToast();

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMassage) {
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMassage("");

                const { data } = await axios.post(
                    '/api/message',
                    {
                        content: newMassage,
                        chatId: selectedChat._id
                    },
                    config)


                // console.log(data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: 'Error occurred!',
                    description: 'Failed to send the message!',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom'
                });
            }
        }
    }

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config)
            setMessages(data);
            // console.log(data);
            setLoading(false)

            socket.emit("join chat", selectedChat._id)
        } catch (error) {
            toast({
                title: 'Error occurred!',
                description: 'Failed to load messages!',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
        }
    }

    useEffect(() => {
        fetchMessages();
        // eslint-disable-next-line
    }, [selectedChat])

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user)
        socket.on('connection', () => setSocketConnected(true))
    }, [])


    const typingHandler = (e) => {
        setNewMassage(e.target.value);

        // Typing Indicator Login Here
    }

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

                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />

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
                        justifyContent='flex-end'
                        p={3}
                        bg='#E8E8E8'
                        w='100%'
                        h='100%'
                        borderRadius='lg'
                        overflowY='hidden'
                    >
                        {loading ? (
                            <Spinner
                                size='xl'
                                w={20}
                                h={20}
                                alignSelf='center'
                                margin='auto'
                            />
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflowY: 'scroll',
                                    overflowX: 'hidden'
                                }} >
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl onKeyDown={sendMessage} isRequired mt={3} >
                            <Input
                                variant='filled'
                                bg='#E0E0E0'
                                placeholder='Enter a message...'
                                value={newMassage}
                                onChange={typingHandler}
                            />
                        </FormControl>
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
