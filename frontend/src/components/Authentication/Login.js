import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import React, { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
 
  const handleClick = ()=> setShow(!show);

  const submitHandler = ()=>{
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
                type={show?"text":"password"}
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
    onClick={()=>submitHandler()}
    >
        Login
    </Button> 

    <Button
    colorScheme='red'
    mt='4px'
    onClick={()=>{
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
