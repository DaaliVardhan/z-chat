import "./conversation.css"
import { useState,useEffect,useContext } from "react";
import { onlineUsers } from "./index";

const Conversation = ({conversation,currentUser,setActiveConversation,className,notify,setNotify}) => {
    const [active,setActive] = useState("")
    const [notification,setNotification] = useState("")
    const [ user, setUser] = useState({
        _id:"",
        username : "",
        picture : "",
        text : "",
        time : "",
    });
    const {online} = useContext(onlineUsers)
    useEffect(()=>{
        const active = online.find((onlineUser)=>user._id===onlineUser) ? "online" : ""
        setActive(active)
        const noti = user._id === notify ? "new" : ""
        setNotification(noti)
    },[online])



    useEffect(() => {
        
        (async ()=>{
            const friendId = conversation.members.find(m => m !== currentUser);
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user?id=${friendId}`,{
                    method : "GET",
                    headers : {
                        "Content-Type" : "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    credentials: 'include',
                })
                const data = await res.json();
                
                setUser(data.user);
            } catch (error) {
                console.log(error);
            }
        })()
    },[])

    
  return (
    <div className={`conversation ${className} ${active}`} onClick={(e)=>{
        setActiveConversation(conversation)
        if(notification==="new"){
            setNotify("");
        }}}>
        <picture className="user-badge">
            <img src={user.picture ? picture : '/user.png'} alt='user' className='profile-img' />
        </picture>
        <div className='conversation-info'>
            <h3 className='username'>{user.username ? user.username : "Username" }</h3>
            <p className='last-message'>
                {user.message ? user.message : ""}
            </p>
        </div>
        <span className={`time ${notification}`}>{
            user.time ? user.time : ""
        }</span>
    </div>
  )
}

export default Conversation;
