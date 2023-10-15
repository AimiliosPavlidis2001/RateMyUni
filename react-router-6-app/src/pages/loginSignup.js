// client/src/pages/LoginSignup.js

import React from 'react';
import { Link } from 'react-router-dom';

function LoginSignup() {
  return (
    <div className="login-signup-buttons">
      <Link to="/login">
        <button className="login-button">Login</button>
      </Link>
      <Link to="/signup">
        <button className="signup-button">Signup</button>
      </Link>
    </div>
  );
}

export default LoginSignup;