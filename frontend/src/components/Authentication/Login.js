import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const history = useHistory();
    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true)
        if (!email || !password) {
            toast({
                title: 'Please fill all the fields!',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": 'application/json'
                },
            };
            const { data } = await axios.post(
                "/api/user/login",
                { email, password },
                config
            )

            toast({
                title: 'Login Successful!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push('/chats');

        } catch (error) {
            toast({
                title: 'Error Occurred!',
                description: error.response.data.message,
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            setLoading(false);
        }

    }

    return (
        <VStack
            spacing={4}
            align='stretch'
        >
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => { setEmail(e.target.value) }}
                    value={email}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>

                <InputGroup size='md'>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Set Your Password'
                        onChange={(e) => { setPassword(e.target.value) }}
                        value={password}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>

            </FormControl>

            <Button
                colorScheme='blue'
                mt='4px'
                onClick={() => submitHandler()}
                isLoading={loading}
            >
                Login
            </Button>

            <Button
                colorScheme='red'
                mt='4px'
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("12345");
                }}
            >
                Get Guest User Credentials
            </Button>

        </VStack>
    )
}

export default Login
