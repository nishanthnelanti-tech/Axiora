import Nav from "./Nav.jsx"
import ChatInput from "./ChatInput.jsx"
import MessageList from "./MessageList.jsx" 

const ChatArea = () => {
  return (
    <div className='flex-1 flex flex-col min-w-0'>
      <Nav/>
      <MessageList/>
      <ChatInput/>

    </div>
  )
}

export default ChatArea