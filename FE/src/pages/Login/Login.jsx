import HandleLogin from '../../components/HandleLogin';
import './Login.css';

 

function Login({ setLoggedIn }) {
    
    return (
         <div className='login-container'>
            
           <form className='login-form'>
            <h1 className='login-h1'>Login</h1>
           <HandleLogin setLoggedIn = { setLoggedIn } ></HandleLogin>
           </form>
           
        </div>
    );
}

export default Login;
