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
import Lottie from 'lottie-react'
import animationData from "../animations/typing.json";

// const ENDPOINT = "http://localhost:5000";
const ENDPOINT = "https://realtime-chatapp-3mrk.onrender.com";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMassage, setNewMassage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    
    const { user, selectedChat, setSelectedChat, notification, setNotification} = ChatState()
    
    const toast = useToast();

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMassage) {
            socket.emit("stop typing", selectedChat._id);
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
                socket.emit("new message", data);
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
        if(selectedChatCompare)
            socket.emit("stop typing", selectedChatCompare._id);

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
        socket = io(ENDPOINT);
        socket.emit("setup", user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => {
            setIsTyping(false);
          });
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || newMessageReceived.chat._id !== selectedChatCompare._id) {
                // give notification
                if(!notification.includes(newMessageReceived.chat)){
                    setNotification([newMessageReceived.chat, ...notification]);
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    })
    
    useEffect(() => {
        fetchMessages();
        // console.log(selectedChatCompare)
        selectedChatCompare = selectedChat
        // console.log(selectedChatCompare)
        setNewMassage("")
        setIsTyping(false)
        setTyping(false)
        // eslint-disable-next-line
    }, [selectedChat])  
    
    // console.log(notification);
    const typingHandler = async(e) => {
        setNewMassage(e.target.value);
        if(newMassage==="") return;

        // Typing Indicator Logic
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
                setIsTyping(false)
            }
        }, timerLength);
    };

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
                            onClick={() => {setSelectedChat("")}}
                        />

                        {selectedChat.isGroupChat ? (
                            <>{selectedChat.chatName.toUpperCase()}

                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />

                            </>
                        ) : (
                            <> {getSender(user, selectedChat.users)}
                                <ProfileModal sender={getSenderFull(user, selectedChat.users)} />
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

                        <FormControl onKeyDown={sendMessage} isRequired >
                            {isTyping ? <div>
                                <Lottie 
                                style={{ width: 100, height:50}} animationData={animationData} loop={true} />
                            </div> : <div style={{ width: 100, height:50}}></div>}
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
