import { useGoogleLogin } from "@react-oauth/google"


const GoogleAuthBtn = ({className}) => {
    const login = useGoogleLogin({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        flow: 'auth-code',
        onSuccess:(response) => { 
            const token = response.code;
            fetch(`${import.meta.env.VITE_SERVER_URL}/api/google-login`,{
                method:"POST",
                body:JSON.stringify({token: response.code}),
                headers:{
                  "Content-Type":"application/json",
                },
              }).then(res=>res.json()).then(data=>{console.log(data);dispatch(addUser(data))});
          
              
        },
        onError: (res) => { console.log(res)}
    })
  return (

      <button className={className} onClick={()=>login()}>Login with Google</button>

  )
}

export default GoogleAuthBtn;
