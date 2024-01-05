import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  useDisclosure,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/chatLogics';
import notificationSound from '../../sounds/notification_tone.mp3'

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState()
  const [compareNotification, setCompareNotification] = useState(0)

  const { user, chats, setChats, setSelectedChat, notification, setNotification, userPic } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const history = useHistory();
  const navigate = useNavigate();
  const toast = useToast();

  
  const aud = new Audio(notificationSound)

  useEffect(() => {
    if(notification > compareNotification)aud.play();
    setCompareNotification(notification)
  }, [notification])
  

    const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    // history.push('/');
    navigate('/')
  }
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter something in search!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-left'
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get(`/api/user?search=${search}`, config);

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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const accessChats = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.post('/api/chat', { userId }, config);

      if (!chats.find(c => c._id === data._id)) setChats([data, ...chats])
      else {
        let index;
        for(let i=chats.length-1;i>=0;i--){
          if(chats[i]._id === data._id){
            index = i;
          }
        }
        for(let i=index;i>0;i--){
          let x = chats[i];
          chats[i] = chats[i-1];
          chats[i-1] = x;
        }
      }

      setSelectedChat(data);
      setLoadingChat(false);
      // setFetchAgain(!fetchAgain);
      onClose();
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error fetching the chat!',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left'
      });
    }
  }

  return (
    <>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        {/* <Tooltip anchorSelect=".my-anchor-element"
          style={{ backgroundColor: "white", color: "black" }}
          place="bottom">
          Search users to chat
        </Tooltip> */}

        <Button onClick={onOpen} className='my-anchor-element' variant='ghost' >
          <i className="fa-solid fa-magnifying-glass"></i>
          <Text d={{ base: "none", md: 'flex' }} px='4'>
            Search User
          </Text>
        </Button>

        <Text fontSize={{base:'19px', sm:'2xl'}} p='0 1em 0 0' fontFamily="Work Sans">
          ChatApp
        </Text>

        <div className='notification-and-profile'>
          <Menu >
            <MenuButton className="icon" p={2}>
              <img src="https://uxwing.com/wp-content/themes/uxwing/download/communication-chat-call/bell-icon.png" className="iconImg" alt="" />
              {
                notification.length > 0 &&
                <div style={{ position: "absolute", top: "10px", right: "15px" }} className="counter">{notification.length}</div>
              }
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages Received"}
              {notification.map((notif) =>
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.isGroupChat
                    ? `New Message in ${notif.chatName}`
                    : `New Message from ${getSender(user, notif.users)}`
                  }
                </MenuItem>
              )}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon display={{base:'none', sm:'block'}} />}>
              <Avatar
                size='sm'
                cursor='pointer'
                name={user.name}
                src={userPic} />
            </MenuButton>

            <MenuList>
              <ProfileModal >
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px' fontSize={{base:"12px", sm:14}} >Search Users</DrawerHeader>
          <DrawerBody >
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)
                }
                onKeyDown={handleKeyPress}
              ></Input>
              <Button className='go-search' onClick={handleSearch}>GO</Button>
            </Box>

            {
              loading ? <ChatLoading />
                : (
                  searchResults?.map(user => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChats(user._id)}
                    >

                    </UserListItem>
                  ))
                )
            }

            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </>
  );
}

export default SideDrawer
