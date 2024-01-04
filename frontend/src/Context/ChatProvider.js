import { createContext, useContext, useState, useEffect } from 'react'
// import { useHistory } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    // const history = useHistory()
    const navigate = useNavigate();
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])
    const [userPic, setUserPic] = useState("")
    const [fetchAgain, setFetchAgain] = useState(false)

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setUser(userInfo);

        if (!userInfo) {
            // history.push("/");
            navigate('/')
            
        }
    }, [navigate])

    return <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification, userPic, setUserPic, fetchAgain, setFetchAgain}}>
        {children}
    </ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;