import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessageIsByReceiver, isMessageByReceiver, isSameSenderMargin, isSameUser } from '../config/chatLogics'
import { ChatState } from '../Context/ChatProvider'
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({ isGroupChat, messages }) => {
    const { user } = ChatState()

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {(isMessageByReceiver(messages, m, i, user._id) ||
                            isLastMessageIsByReceiver(messages, i, user._id)) && (
                                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            )}

                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#0f6c73" : "#2a75ae"}`,
                                borderRadius: '20px',
                                color: 'white',
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                                padding: '5px 15px',
                                maxWidth: '75%'
                            }}
                        >
                            {isGroupChat && m.sender._id !== user._id
                                ? <div style={{ display: 'flex', flexDirection: 'column' }}  >
                                    <div style={{ fontSize: '12px', fontFamily: 'cursive', color: '#FFEB3B' }} >
                                        {m.sender.name} :
                                    </div>
                                    <div>
                                        {m.content}
                                    </div>
                                </div>
                                : <>{m.content}</>
                            }

                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat
