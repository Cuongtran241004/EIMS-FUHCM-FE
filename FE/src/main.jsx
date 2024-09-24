import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <GoogleOAuthProvider clientId="978042577042-vatgfmf5is9c0eocn1b8q21cjfproler.apps.googleusercontent.com">
    <Router>
    <App />
  </Router>
    </GoogleOAuthProvider>
  </StrictMode>,
)
