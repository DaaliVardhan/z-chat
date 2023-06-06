import bg from '../../assets/bg.png'
import googleImg from '../../assets/google.png'
import { Link, useNavigate } from 'react-router-dom'
import './styles.css'
import { useState,useRef } from 'react';
import Loading from '../../loader';

const register = () => {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);

    const handleSubmit = async (e) =>{
      e.preventDefault();
      setLoading(true);
      const username = nameRef.current.value;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      try{
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`,{
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          credentials: 'include',
          body:JSON.stringify({username,email,password}),
        })
        if(!response.ok)
        {
          const data = await response.json();
          setLoading(false);
          setError(data.message);
        }
        else{
          const data = await response.json();
          // console.log(data);
          setLoading(false);
          navigate('/');
        }
        

        

      } catch (error) {
        setLoading(false);
        console.log(error)
      }

    }


    return (
        <section className='login-container'>
          <img src={bg} alt='bg' className='login-bg' />
            <article className='form-container'>
              <h1 className='heading'>Register</h1>
              <div className='social-icons'>
                <button className="google-btn"><img className='google-icon' src={googleImg} alt="google icon"></img></button>
              </div>
              <div className='divider'>
                or
              </div>
              <form className='form' onSubmit={handleSubmit}>
                <p style={{color:"red"}}>{error}</p>
                <div className='form-group'>
                  <label htmlFor='name'>Username</label>
                  <input type='name' id='name' placeholder='Name' ref={nameRef} />
                </div>
                <div className='form-group'>
                  <label htmlFor='email'>Email</label>
                  <input type='email' id='email' placeholder='Email' ref={emailRef} />
                </div>
                <div className='form-group'>
                  <label htmlFor='password'>Password</label>
                  <input type='password' id='password' placeholder='Password'ref={passwordRef} />
                </div>
                <div className='form-group'>
                  <button type='submit' className='submit-btn' >{loading ? <Loading /> : "Register"}</button>
                  <p>Already have an account ? <Link to="/">Login</Link></p>
                </div>
    
              </form>
              
    
            </article>
        </section>
      )
}

export default register
