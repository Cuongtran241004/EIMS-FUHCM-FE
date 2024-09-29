import HandleLogin from "./HandleLogin";
import "./Login.css";

function Login() {
  const googleLogin = () => {
    window.location.href = "http://localhost:8080/eims-fuhcm-be/oauth2/authorization/google";
  };
  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-h1">Login</h1>
        <button onClick={googleLogin}>Login with Google</button>
      </div>
    </div>
  );
}

export default Login;
