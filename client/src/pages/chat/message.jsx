
import './message.css';
import TimeAgo from 'timeago-react'

const Message = ({message,className}) => {
   
  return (
    <div className={`message-container ${className}`}>
        <picture className={`user-icon`}>
            <img src='/user.png' alt='user' className='profile-img' />
        </picture>
        <div className='message-body' data-user={message.sender}>
            <p className='message'>
                {message.text}
            </p>
            <span className='time'>
                {message.time ? <TimeAgo datetime={message.time} />: '12:00'}
            </span>
        </div>

      
    </div>
  )
}

export default Message
