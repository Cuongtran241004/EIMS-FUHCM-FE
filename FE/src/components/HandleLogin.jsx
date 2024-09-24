import { GoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import axios from 'axios';

function HandleLogin({ setLoggedIn }) {

    const [errorMessage, setErrorMessage] = useState('');
    const [allowedEmails, setAllowedEmails] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('https://66ed7da7380821644cdd07d1.mockapi.io/notification/Login');
            setAllowedEmails(response.data.map((login) => login.email));
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

      return (
        <div>
            <GoogleLogin
        onSuccess={(credentialResponse) => {
            const token = credentialResponse.credential; // Lấy token từ phản hồi
            const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã JWT để lấy thông tin người dùng

            const userEmail = payload.email; // Lấy email của người dùng từ token
            const expirationTime = new Date().getTime() + 60 * 60 * 1000; // Duy trì đăng nhập trong 1 tiếng
            // Kiểm tra email có trong danh sách allowedEmails không
            if (allowedEmails.includes(userEmail)) {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', userEmail);
                sessionStorage.setItem('expirationTime', expirationTime);
                setLoggedIn(true);
                setErrorMessage('');
                console.log(token)
                console.log(payload)
            } else {
                setErrorMessage('You do not have permission to login this');
            }
        }}
        onError={() => {
            errorMessage('Login Failed');
        }}
    />
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      )
}
export default HandleLogin;