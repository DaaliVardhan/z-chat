import bg from '../../assets/bg.png'
import googleImg from '../../assets/google.png'
import { Link, useNavigate } from 'react-router-dom'
import './styles.css'
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from '../../context/userSlice';
import secureLocalStorage from 'react-secure-storage';
import {useRef,useState,useEffect} from 'react';
import cookies from 'js-cookie';
import Loader from '../../loader';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let user = useSelector(state => state.user);
  const [loading,setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error,setError] = useState(null);
  
  useEffect(()=>{
    const oldUser = cookies.get('user');
    if(oldUser)
    {
      dispatch(addUser(JSON.parse(oldUser)));
      navigate('/chat');
    }

  },[])
  


  const handleLogin = async (e) =>{
    e.preventDefault();
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`,{
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: 'include',
      body:JSON.stringify({email,password}),
    })
    if(!response.ok)
    {
      const data = await response.json();
      setError(data.message);
      setLoading(false);
    }
    else{
      const data = await response.json();
      secureLocalStorage.setItem("user",data);
      cookies.set("user",JSON.stringify(
        {username:data.username,userId:data.userId,email:data.email,picture:data.picture}
      ),{expires:1})
      dispatch(addUser(data));
      setLoading(false);
      navigate('/chat');
    }

  }

  return (
    <section className='login-container'>
      <img src={bg} alt='bg' className='login-bg' />
        <article className='form-container'>
          <h1 className='heading'>Sign In</h1>
          <div className='social-icons'>
            <button className="google-btn"><img className='google-icon' src={googleImg} alt="google icon"></img></button>
          </div>
          <div className='divider'>
            or
          </div>
          <form className='form' onSubmit={handleLogin}>
          <p style={{color:"red"}}>{error}</p>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type='email' id='email' placeholder='Email' ref={emailRef} />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' placeholder='Password' ref={passwordRef}/>
            </div>
            <div className='form-group'>
              <button type='submit' className='submit-btn' >{loading? <Loader /> : "Login"}</button>
              <p>Create an account ? <Link to="/register">Register</Link></p>
            </div>

          </form>
          

        </article>
    </section>
  )
}

export default Login
