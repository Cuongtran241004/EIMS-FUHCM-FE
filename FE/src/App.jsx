import { useState, useEffect } from 'react'
import Login from './pages/Login/Login'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Logout from './components/Logout';
import './App.css';

function App() {
  const [LoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    const expirationTime = sessionStorage.getItem('expirationTime');
    const currentTime = new Date().getTime();
    if (loggedIn === 'true' && currentTime < expirationTime) {
      setLoggedIn(true);
    } else {
      sessionStorage.clear();
    }
  }, []);


  return (
    <>
      <div className='container'>
        {
          !LoggedIn ? (
              <Login setLoggedIn={setLoggedIn} />
          ) : (
        <div>
            <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <Logout setLoggedIn={setLoggedIn} />
        </div>
          )
        }


      </div>
    </>
  )
}

export default App
