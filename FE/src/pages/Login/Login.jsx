// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import  GoogleLogin  from '../../components/GoogleLogin';
// import { postLoginToken } from '../../components/api/postLoginToken';
// import './Login.css';
// import LoginForm from './LoginForm';
//
// export default function Login({ isLogin, setIsLogin }) {
//   const navigate = useNavigate();
//
//   // https://stackoverflow.com/questions/49819183/react-what-is-the-best-way-to-handle-login-and-authentication
//   const onGoogleSignIn = async res => {
//     const { credential } = res;
//     const result = await postLoginToken(credential, setIsLogin);
//     setIsLogin(result);
//   };
//
//   useEffect(() => {
//     if (!isLogin) return;
//     navigate('/dashboard');
//   }, [isLogin]);
//
//   return (
//     <div className="login-container">
//       <div className="login-form">
//         <h1 className="login-h1">Login</h1>
//         <div className="login-form-section">
//           <div className="form-section">
//             <LoginForm />
//           </div>
//           <div className="divider"></div>
//
//
//           <div className="form-section">
//           <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="Login with Google" />
//           </div>
//         </div>
//       </div>
//     </div>
//
//   );
// }

import React, { useContext } from 'react';
import { UserContext } from '../../components/UserContext';
import GoogleLogin from '../../components/GoogleLogin';
import { postLoginToken } from '../../components/api/postLoginToken';
import './Login.css';
import LoginForm from './LoginForm';
import { getUserInfo } from '../../components/API/getUserInfo';

export default function Login({setIsLogin}) {
  const { setUser } = useContext(UserContext);

  const onGoogleSignIn = async (res) => {
    const { credential } = res;
    const result = await postLoginToken(credential);
    console.log('Login result:', result);
    if(result) {
      const initInfo = await getUserInfo();
      const userInfo = {
        role: initInfo.role.name,
        firstName: initInfo.firstName,
        lastName: initInfo.lastName,
      };

      // Save user information to localStorage
      localStorage.setItem('role', userInfo.role);
      localStorage.setItem('firstName', userInfo.firstName);
      localStorage.setItem('lastName', userInfo.lastName);
      console.log('user info ',userInfo);

      // Set user information in context
      setUser(userInfo);
      setIsLogin(true);
    }
  };



  return (
      <div className="login-container">
        <div className="login-form">
          <h1 className="login-h1">Login</h1>
          <div className="login-form-section">
            <div className="form-section">
              <LoginForm />
            </div>
            <div className="divider"></div>
            <div className="form-section">
              <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="Login with Google" />
            </div>
          </div>
        </div>
      </div>
  );
}