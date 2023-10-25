import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route, Routes } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import { ChatState } from "./Context/ChatProvider";

function App() {
    const { mode } = ChatState();

    const appStyles = {
      minHeight: "100vh",
      display: "flex",
      background: mode
        ? "#000000"
        : "radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%)",
    };

  return (
    <div className="App" style={appStyles}>
      <Routes>
        <Route path="/" Component={Homepage} exact />
        <Route path="/chats" Component={Chatpage} />
      </Routes>
    </div>
  );
}

export default App;
