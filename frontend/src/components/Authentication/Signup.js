import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
// import { useHistory } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    // const history = useHistory();
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);

    const postDetails = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: 'Please select an image!',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dfgy1sffv");
            fetch("https://api.cloudinary.com/v1_1/dfgy1sffv/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                })

        } else {
            toast({
                title: 'Please select an image with extension jpeg or png',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: 'Please fill all the fields!',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        if (password !== confirmpassword) {
            toast({
                title: 'Passwords do not match!',
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
                "/api/user",
                { name, email, password, pic },
                config
            )

            toast({
                title: 'Registration Successful!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            // history.push('/chats');
            navigate('/chats');
        }
        catch (error) {
            toast({
                title: 'Error Occurred !',
                description: error.response.data.message,
                status: 'error',
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

            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter Your Name'
                    onChange={(e) => { setName(e.target.value) }}
                />
            </FormControl>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => { setEmail(e.target.value) }}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>

                <InputGroup size='md'>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Set Your Password'
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>

            </FormControl>

            <FormControl id='confirmpassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>

                <InputGroup size='md'>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Confirm Password'
                        onChange={(e) => { setConfirmpassword(e.target.value) }}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>

            </FormControl>

            <FormControl id='pic' isRequired>
                <FormLabel>Upload your picture</FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => { postDetails(e.target.files[0]) }}
                />
            </FormControl>

            <Button
                colorScheme='blue'
                mt='4px'
                onClick={() => submitHandler()}
                isLoading={loading}
            >
                Sign Up
            </Button>

        </VStack>
    )
}

export default SignUp
