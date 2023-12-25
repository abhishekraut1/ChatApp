import {createContext, useContext, useState, useHistory, useEffect} from 'react'

const ChatContext = createContext();

const ChatProvider = ({children})=>{
    const history = useHistory()

    useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))

      if(!userInfo){
        history.push("/chat");
      }
    }, [history]) 

    return <ChatContext.Provider>{children}</ChatContext.Provider>
}

export const ChatState = ()=>{
    return useContext(ChatContext);
}

export default ChatProvider;