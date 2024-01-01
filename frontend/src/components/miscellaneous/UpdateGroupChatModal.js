import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    useToast,
    Spinner,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState("")
    const [search, setSearch] = useState()
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const toast = useToast();

    const { user, selectedChat, setSelectedChat } = ChatState();

    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast({
                title: 'User already in group!',
                description: "Failed to Load the Search Results",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(
                `/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: userToAdd._id
                },
                config
            )

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Unable to add user to group!',
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false)
        }
    }
    const handleRemove = async (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            toast({
                title: 'Only admins can remove someone!',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(
                `/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: userToRemove._id
                },
                config
            )

            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Unable to add remove user from group!',
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false)
        }
    }

    const handleRename = async () => {
        if (!groupChatName)
            return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    }

    const handleSearch = async (query) => {
        setSearch(query);
        // if (!query) {
        //     toast({
        //         title: 'Please enter something in search!',
        //         status: 'warning',
        //         duration: 3000,
        //         isClosable: true,
        //         position: 'top-left'
        //     });
        //     return;
        // }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${query}`, config);

            setLoading(false);
            setSearchResults(data);
        } catch (error) {
            toast({
                title: 'Error Occurred!',
                description: "Failed to Load the Search Results",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            });
        }
    }

    return (
        <>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen}></IconButton>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center"
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <Box
                            w="100%" display="flex" flexWrap="wrap" pb={3}
                        >
                            {selectedChat.users.map((u) =>
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)} />
                            )}
                        </Box>

                        <FormControl
                            display='flex'
                        >
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)} ></Input>
                            <Button
                                variant='solid'
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename} >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl
                            display='flex'
                        >
                            <Input
                                placeholder='Add user to group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)} >
                            </Input>
                        </FormControl>
                        {loading ? (
                            <Spinner size='lg' />
                        ) : (
                            searchResults?.map((u) =>
                                <UserListItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleAddUser(u)}
                                />
                            )
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
