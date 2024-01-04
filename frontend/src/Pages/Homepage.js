import { React, useEffect } from 'react'
// import {useHistory} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { Container, Box, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'

const Homepage = () => {
  // const history = useHistory()
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"))

    if (user) {
      // history.push("/chats"); 
      navigate("/chats"); 
      
    }
  }, [navigate])

  return (
    <Container maxWidth='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w='100%'
        m='2rem 0 1rem 0'
        borderRadius='lg'
        borderWidth='2px'
      >
        <Text fontSize='4xl' align='center' fontFamily='Work sans' color='black'>
          ChatApp
        </Text>
      </Box>
      <Box bg='white' w='100%' color='black' borderRadius='md'>
        <Tabs isFitted variant='soft-rounded' >
          <TabList mb='1em'>
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login></Login>
            </TabPanel>
            <TabPanel>
              <Signup></Signup>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage
