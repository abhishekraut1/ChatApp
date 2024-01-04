import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import randomUser from '../../images/randomUser.png'

const ProfileModal = ({sender, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {
                children ? (<span onClick={onOpen}>{children}</span>)
                    : (
                        <IconButton onClick={onOpen} d={{ base: 'flex' }} icon={<ViewIcon />} ></IconButton>
                    )
            }

            <Modal size='lg' isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent h='25rem'>
                    <ModalHeader
                        fontSize='40px'
                        fontFamily='Work Sans'
                        display='flex'
                        justifyContent='center'
                    >
                        {sender ? sender.name : ""}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody                    
                    display='flex' 
                    flexDir='column' 
                    alignItems='center'
                    justifyContent='space-between'
                    >
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src={sender ? (sender.pic ? sender.pic: randomUser ) : ""}
                            alt={sender ? sender.name : ""}
                        ></Image>
                        
                        <Text
                        fontSize={{base: '28px', md: '30px'}}
                        fontFamily='Work Sans'

                        >
                            Email: {sender ? sender.email : ""}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' marginTop='-7px' onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
