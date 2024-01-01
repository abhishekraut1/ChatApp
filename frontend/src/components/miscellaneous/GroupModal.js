import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast();
    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            // console.log(data);
            setLoading(false)
            setSearchResults(data)
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
    const handleSubmit = async() => {
        if(!groupChatName || !selectedUsers){
            toast({
                title: 'Please fill all the fields!',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        try {
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data} = await axios.post('/api/chat/group',
            {
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=>u._id))
            },
            config);
            setChats([data,...chats])
            clearSearchedAndSelectedUsers();
            // console.log(data)
            toast({
                title: 'New Group Chat Created!',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
        } catch (error) {
            toast({
                title: 'Failed to create group!',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already added!',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(
            selectedUsers.filter(user => user._id !== userToDelete._id)
        );
    }

    const clearSearchedAndSelectedUsers = () => {
        setSelectedUsers([]);
        setSearchResults([]);
        onClose();
    }
    

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work Sans'
                        display='flex'
                        justifyContent='center'
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        pb={6}
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                    >
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            >
                            </Input>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            >
                            </Input>
                        </FormControl>
                        <Box
                            width='100%'
                            display='flex'
                            flexWrap='wrap'
                        >
                            {selectedUsers?.map(user => (
                                <UserBadgeItem key={user._id}
                                    user={user}
                                    handleFunction={() => handleDelete(user)} />
                            ))}
                        </Box>
                        {loading ? (
                            <div>loading</div>
                        ) : (
                            searchResults?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)} />))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' bg='red' mx={2} onClick={() => {
                            clearSearchedAndSelectedUsers();
                        }} >Close</Button>
                        <Button colorScheme='blue' onClick={handleSubmit}>Create Chat</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupModal
