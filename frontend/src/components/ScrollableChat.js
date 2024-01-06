import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessageIsByReceiver, isMessageByReceiver, isSameSenderMargin, isSameUser } from '../config/chatLogics'
import { ChatState } from '../Context/ChatProvider'
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({ isGroupChat, messages }) => {
    const { user } = ChatState()
    console.log(messages)

    const time = (str) => {
        const dateString = str;
        const date = new Date(dateString);

        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata',
        };
        console.log(date.toLocaleString('en-IN', options))
        return date.toLocaleString('en-IN', options);
    }

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
                            {isGroupChat
                                ? <div style={{ display: 'flex', flexDirection: 'column' }}  >
                                    {
                                        m.sender._id !== user._id 
                                        ? <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#b8daf3' }} >
                                        {m.sender.name} :
                                        </div>
                                        : <></>
                                    }
                                    
                                    <div>
                                        {m.content}
                                    </div>

                                    {m.sender._id === user._id 
                                    ? 
                                    <div style={{ fontSize: "9px", color: "#b8daf3", marginTop: "8px", textAlign: 'right' }} >{time(m.createdAt)}
                                    </div>
                                    : 
                                    <div style={{ fontSize: "9px", color: "#b8daf3", marginTop: "8px" }} >{time(m.createdAt)}
                                    </div>
                                    }
                                    
                                </div>
                                :
                                 <div style={{ display: 'flex', flexDirection: 'column' }} >
                                    <div>{m.content}</div>
                                    {
                                        m.sender._id === user._id 
                                        ? <div style={{
                                            fontSize: "9px", color: "#b8daf3", marginTop: "8px", textAlign: 'right'
                                        }} >{time(m.createdAt)}
                                        </div>
                                        : <div style={{
                                            fontSize: "9px", color: "#b8daf3", marginTop: "8px",
                                        }} >{time(m.createdAt)}
                                        </div>
                                    }
                                    
                                </div>
                            }

                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat
