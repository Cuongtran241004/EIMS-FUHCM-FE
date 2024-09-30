import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  GoogleLogin  from '../../components/GoogleLogin';
import { postLoginToken } from '../../components/api/postLoginToken';
import './Login.css';
import LoginForm from './LoginForm';

export default function Login({ isLogin, setIsLogin }) {
  const navigate = useNavigate();

  // https://stackoverflow.com/questions/49819183/react-what-is-the-best-way-to-handle-login-and-authentication
  const onGoogleSignIn = async res => {
    const { credential } = res;
    const result = await postLoginToken(credential, setIsLogin);
    setIsLogin(result);
  };

  useEffect(() => {
    if (!isLogin) return;
    navigate('/dashboard');
  }, [isLogin]);

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