import React,{useState,useRef,useEffect,createContext} from 'react'
import './chat.css'
import {FaSearch} from 'react-icons/fa'
import { HiUserAdd } from 'react-icons/hi'
import { AiOutlineMenu,AiOutlineClose } from 'react-icons/ai'
import { MdSend } from 'react-icons/md'
import Conversation from './conversation'
import Message from './message'
import Users from './users';
import { useSelector,useDispatch } from 'react-redux'
import { addUser } from '../../context/userSlice'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { io } from "socket.io-client";
const onlineUsers = createContext({});

const Chat = () => {
  const [online,setOnline] = useState([]);
  const [active,setActive] = useState("")
  const user = useSelector(state => state.user);
  const [receiver,setReceiver] = useState(null);
  const dispatch = useDispatch();
  const [search,setSearch] = useState("");
  const [searchResults,setSearchResults] = useState([]);
  const [messages,setMessages] = useState(null);
  const [users,setUsers] = useState([]);
  const [conversation,setConversation] = useState(users);
  const navigate = useNavigate();
  const [activeConversation,setActiveConversation] = useState(null);
  const bottomRef = useRef(null);
  const textRef = useRef(null);
  const messagesRef = useRef(null);
  const socket = useRef(null);
  const [toggle,setToggle] = useState(true);
  const [notify,setNotify] = useState(null);


  useEffect(()=>{
    const oldUser = Cookies.get('user');
    if(oldUser && user.userId === null){
      dispatch(addUser(JSON.parse(oldUser)));
    }    
  },[])
  useEffect(()=>{
    if(!user || !user.userId || user.userId===null) return navigate('/');
    socket.current = io(import.meta.env.VITE_SERVER_URL);

  },[])


  

  useEffect(()=>{
    if(!socket.current) return;
    socket.current.emit('online',user.userId);
    // socket.current.on('allUsers')
    socket.current.on('online',(onlineUsers)=>{
      setOnline(onlineUsers);
    })
    socket.current.on('userDisconnect',(onlineUsers)=>{
      setOnline(onlineUsers);
    })

    socket.current.on('message',(message)=>{
      // console.log("message",message,messages,activeConversation);
      if(!activeConversation || message.conversationId !== activeConversation._id){
        setNotify(message.receiver);
        return;
      };
      if(!messages || !activeConversation || message.conversationId !== activeConversation._id) return;
      setMessages([...messages,message]);
    })
  },[socket])

  const getReceiver = () =>{
    if(!activeConversation) return setReceiver(null);
    const friendId = activeConversation.members.find(m => m !== user.userId);
    const friend = users.find(user => user._id === friendId);
    setReceiver(friend);
  }

  
  const handleSearch = (e) => {
    setSearch(e.target.value);
    if(e.target.value === "") return setSearchResults([]);
    const results = users;
    setSearchResults(results);
  }


  const getUsers = async () => {

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user`,{
        method : "GET",
        headers : {
          "Content-Type" : "application/json"
        },
        credentials: 'include',
      })
      if(!response.ok)
      {
        const data = await response.json();
        console.log(data.message);
      }
      else{
        const data = await response.json();
        setUsers(data.users);
      }
  }

  const getConversations = async () =>{
    if(!user || !user.userId) return setConversation([])
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/conversation/${user.userId}`,{
      method : "GET",
      headers : {
        "Content-Type" : "application/json"
      },
      credentials: 'include',
    })

    if(!response.ok)
        setConversation([]);
    else{
      const data = await response.json();
      setConversation(data);
      // if(!activeConversation) setActiveConversation(data[0]);
      getReceiver();
    }
  }

  const getMessages = async () =>{
      if(!activeConversation) return setMessages([]);
      const messages = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/message/${activeConversation._id}`,{
        method : "GET",
        headers : {
          "Content-Type" : "application/json"
        },
        credentials: 'include',

      })
      if(!messages.ok)
          console.log("Error while fetching messages");
      else{
        const data = await messages.json();
        setMessages(data);
      }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const time = new Date()
    const message = {
      conversationId:activeConversation._id,
      sender:user.userId,
      receiver:activeConversation.members.find((member)=> member !== user.userId),
      text:textRef.current.value,
      time : time.toLocaleTimeString()
    }
    await fetch(`${import.meta.env.VITE_SERVER_URL}/api/message`,{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      credentials: 'include',
      body:JSON.stringify(message)
    })
    setMessages([...messages,message]);
    socket.current.emit('message',message);
    textRef.current.value = "";
  }
  useEffect(() => {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [bottomRef,messages])
  useEffect(()=>{
    getUsers();
  },[])
  useEffect(()=>{
   getConversations();
   getReceiver();
  },[activeConversation])

  useEffect(()=>{
    getMessages();   
    setSearchResults([]) 
  },[activeConversation])
  useEffect(()=>{
    const active =( receiver && online.find((onlineUser)=>receiver._id===onlineUser)  ) ? "online" : ""
    setActive(active)
  },[online,receiver,conversation])




  return (
    <onlineUsers.Provider value={{online,setOnline}}>
    <section className='chat' >
      <aside className={`sidebar ${toggle ? "toggle" : ""}`} >
        <div className='sidebar-header'>
          {/* <picture>
            <img src='/user.png' alt='user' className='profile-img' />
          </picture> */}
          <h3 className='chat-header-title'> Messages</h3>
          <div className='search'>
            <FaSearch className='search-icon' htmlFor="search"/>
            <input type='text' className='search-input' id='search' autoComplete='off'
            value={search} onChange={(e)=>handleSearch(e)}
             placeholder='Search or start a new chat' />
            <button className='add-user'><HiUserAdd className='add-user-icon' /></button>
          </div>

        </div>
        <div className='conversation-container'>
        { search ? (<h3 className='sidebar-title'> Search Results</h3>) : ""}
        <div className='search-results' style={{border:"none"}}>
        {(searchResults && searchResults.length > 0) ? searchResults.map(
          (user,index)=> <Users key={index} setSearch={setSearch} user={user} setConversation={setConversation} conversation={conversation} setActiveConversation={setActiveConversation} />
        ) : ""}

        </div>
        <h3 className='sidebar-title'> Conversations</h3>
          {(conversation && conversation.length > 0) ? conversation.map((conversation,index)=>{
            return(
              <Conversation key={index} conversation={conversation} className={`${activeConversation===conversation ? "active" : ""}`} setActiveConversation={setActiveConversation} currentUser = {user.userId}  notify={notify} setNotify={setNotify} />
            )
          }) :  (<h3>No Conversations</h3>)}
          

        </div>
      </aside>
      { !activeConversation ?  (<aside className='chat-box placeholder'><div className='hidden' ref={bottomRef}><h1>Click on Conversation to start</h1></div></aside>) : 
          (<aside className='chat-box'>
            <div className='chat-box-header'>
            <div className='chat-user-wrapper'>
              <picture>
                <img src='/user.png' alt='user' className='profile-img' />
              </picture>
              <div className=''>
                <h3 className='chat-header-title'>{receiver ? receiver.username : "Username"}</h3>
                {online ? (<p className=''>{active}</p>) : "" }
              </div>
            </div>
            <div className='chat-box-header-icons'>
              <button className='chat-box-header-btn' onClick={()=>setToggle(toggle=>!toggle)}>{ toggle ? <AiOutlineClose className='chat-box-header-icon' /> : <AiOutlineMenu className='chat-box-header-icon'/> }</button>
            </div>

            </div>
            <div className='chat-box-body'  ref={messagesRef}>
              {(messages && messages.length > 0) ? messages.map((message,index)=>{
                return(
                  <Message key={index} className={message.sender === user.userId ? "sender" : "receiver"} message={message}  />
                )
              }) : (<h3>No Messages</h3>)}
              <div className='hidden' ref={bottomRef}></div>
            </div>
            <form className='chat-box-footer' onSubmit={handleSubmit}>
              <input type='text' className='chat-box-footer-input' placeholder='Type a message' ref={textRef} />
              <button className='chat-box-footer-btn' type='submit'  onDoubleClick={(e)=>console.log(conversation,activeConversation,messages,user)}><MdSend className="send-btn-icon" /></button>

            </form>
          </aside>
          )
      }
    </section>
    </onlineUsers.Provider>
  )
}

export default Chat
export {onlineUsers}
