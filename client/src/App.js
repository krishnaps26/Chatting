//----------------------------------- Functional Based Components --------------------------------------------------
import './App.css';
import io from 'socket.io-client'
import { useEffect, useState } from "react"

const socket = io("http://localhost:3000", { transports : ['websocket'] })
function App() {
  const [room, setRoom] = useState("")
  const [message, setMessage] = useState("")
  const [messageReceived, setMessageReceived] = useState([])
  const [messages, setMessages] = useState([])

  const joinRoom = () => {
    if(room !== ""){
      socket.emit("join_room", room)
    }
  }

  
  // for latest message only -------- no message stored -----------------------------
   
  // const sendMessage = () => {
  //   socket.emit("send_message", {message, room})
  // }

  // useEffect(() => {
  //   socket.on("receive_message", (data) => {
  //     setMessageReceived({message: data.message, sender: data.sender})
  //   })
  // },[socket])


  //for storing messages in a state----------------------------------------------------
  const sendMessage = () => {
    if(!message || !room){
      console.error("message and room no. is required")
      return;
    }
    socket.emit("send_message", {message, room})
    // setMessageReceived([...messageReceived, { message, sender: socket.id }])
  }
  useEffect(() => {
    socket.on('chat_history', (chatHistory) => {
      setMessages(chatHistory);
    });
  },[socket])
  useEffect(() => {
    // console.log("message",messageReceived)
    socket.on("receive_message", (data) => {
      setMessageReceived([...messageReceived, {message: data.message, sender: data.sender}])
    })
  },[socket, messageReceived])

  // console.log(messageReceived)

  const container = document.getElementById("root")
  return (
    <div className="App">
      <input placeholder='enter room' onChange={(event) => {
        setRoom(event.target.value)
      }}/>
      <button onClick={joinRoom}>Join Room</button>

      <br />

      <input placeholder='Message...' onChange={(event) => {
        setMessage(event.target.value)
      }}/>
      <button onClick={sendMessage}>Send Message</button>
      
      {/* for latest message only  */}
      {/* <div className="message-container">
          <div
            className={messageReceived.sender === socket.id ? 'right-side' : 'left-side'}
          >
            <h1>Message: {messageReceived.message}</h1>
          </div>
      </div> */}

      <div className="message-container">
      <h1>messages</h1>
        {messageReceived.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === socket.id ? 'right-side' : 'left-side'}
          >
            <h3>
              {msg.message}
            </h3>
                      
          </div>
        ))}
      </div>

      <div>
      <h1>Chat History</h1>
      {Array.isArray(messages) ? (
        <div>{
          messages.map((mes,ind) => (
            <div key={ind}>
               <ul>
                  {mes.message} By -----&gt; {mes.sender}
               </ul>
            </div>
          ))
        }</div>
      ) : (
        <p>{`Messages is not an array: ${messages}`}</p>
      )}
    </div>
    </div>
  );
}

export default App;

