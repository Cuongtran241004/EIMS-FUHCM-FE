import HandleLogin from "./HandleLogin";
import "./Login.css";
import Form from "./Form";

function Login({ setLoggedIn }) {
  return (
    <div className="login-container">
      <form className="login-form">
        <h1 className="login-h1">Login</h1>
        <div className="login-form-section">
          <div className="form-section">
            <Form />
          </div>
          <div className="divider"></div>


          <div className="form-section">
            <HandleLogin setLoggedIn={setLoggedIn} />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
