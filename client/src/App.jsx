import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Chat from './pages/chat';
const App = () => {
  return (

    

      <Router>
        <Routes>
          <Route path='/'  element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/chat' element={<Chat />} />
        </Routes>
      </Router>

   

  )
}

export default App;