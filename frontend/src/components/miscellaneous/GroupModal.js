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

    useEffect(() => {
      setSelectedUsers([user])
    //   console.log(selectedUsers)
    }, [])
    

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            setSearchResults([])
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${query}`, config);
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
        // let adminIndex = 0;
        // for(let i=0;i<selectedUsers.length;i++){
        //     if(selectedUsers[i]._id === user._id){
        //         adminIndex = i;
        //         break;
        //     }
        // }

        // for(let i=adminIndex;i>0;i--){
        //     let x = selectedUsers[i];
        //     selectedUsers[i] = selectedUsers[i-1];
        //     selectedUsers[i-1] = x;
        // }
        // console.log(adminIndex)
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
                title: 'Group must include more than 2 users.',
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
        setSelectedUsers([user]);
        setSearchResults([]);
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
                    <ModalCloseButton onClick={clearSearchedAndSelectedUsers} />
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
                            <div>loading...</div>
                        ) : (
                            searchResults?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)} />))
                        )}
                    </ModalBody>

                    <ModalFooter display='flex' justifyContent='space-between'>
                        <Button color='white' bg='red' mx={2} onClick={() => {
                            clearSearchedAndSelectedUsers(); onClose();
                        }} >Close</Button>
                        <Button colorScheme='blue' onClick={()=>{handleSubmit(); onClose();}}>Create Chat</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupModal
