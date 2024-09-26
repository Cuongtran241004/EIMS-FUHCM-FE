import HandleLogin from "./HandleLogin";
import "./Login.css";
import LoginForm from "./LoginForm";

function Login({ setLoggedIn }) {
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
            <HandleLogin setLoggedIn={setLoggedIn} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
