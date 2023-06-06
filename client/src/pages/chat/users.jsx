
import "./conversation.css"
import { useSelector } from "react-redux"
import { useContext,useState,useEffect} from 'react'
import { onlineUsers } from "./index";

const Users = ({user,className,setConversation,conversation,setActiveConversation,setSearch}) => {
    const currentUser = useSelector(state=> state.user)
    const [active,setActive] = useState("")
    const {online} = useContext(onlineUsers)

    useEffect(()=>{
        const active = online.find((onlineUser)=>user._id===onlineUser) ? "online" : ""
        setActive(active)
    },[online])

    const handleClick = async (e) =>{
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/conversation`,{
                method:"POST",
                body:JSON.stringify({sender:currentUser.userId,receiver:user._id}),
                headers:{
                    "Content-Type":"application/json",
                },
                credentials:'include',
            })
            if(!response.ok){
                const data = await response.json()
                console.log(data.message);
            }
            else{
                const data = await response.json();
                setSearch("")
                setConversation(...conversation,data)
                setActiveConversation(data)
            }               

        }catch(e){
            console.log(e);
        }
    }

  return (
        <div className={`conversation ${className}`}  onClick={(e)=>handleClick(e)}>
            <picture className={`user-badge ${active}`}>
                <img src={user.picture ? picture : '/user.png'} alt='user' className='profile-img' />
            </picture>
            <div className='conversation-info'>
                <h3 className='username'>{user.username ? user.username : "Username" }</h3>
                <p className='last-message'>
                    {user.text ? user.text : "last message"}
                </p>
            </div>
            <span className='time'>{
                user.time ? user.time : "12:00"
            }</span>
    </div>
  )
}

export default Users;
