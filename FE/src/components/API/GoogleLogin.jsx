import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import useScript from "../Hook/useScript";

function GoogleLogin({
  onGoogleSignIn = () => {},
  text = "Sign in with Google",
}) {
  const googleSignInButton = useRef(null);

  useScript("https://accounts.google.com/gsi/client", () => {
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
        callback: onGoogleSignIn,
      });
      window.google.accounts.id.renderButton(googleSignInButton.current, {
        theme: "filled_blue",
        size: "large",
        text,
        width: "250",
      });
    } catch (error) {
      console.error("Google Sign-In initialization error:", error);
    }
  });

  return <div ref={googleSignInButton} aria-label={text}></div>;
}

GoogleLogin.propTypes = {
  onGoogleSignIn: PropTypes.func,
  text: PropTypes.string,
};

export default GoogleLogin;
