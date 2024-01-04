import './App.css';
import Homepage from './Pages/Homepage'
import ChatPage from './Pages/ChatPage';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom"; 

function App() {
  return (
    <div className="App"> 
      <Routes>
      <Route path='/'  element={<Homepage />}></Route>
      <Route path='/chats'  element={<ChatPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
