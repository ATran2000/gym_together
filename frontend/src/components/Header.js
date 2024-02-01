import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);

  return (
    <div>
      <Link to="/">Home</Link>
      {user ? (
        <div>
          <Link onClick={logoutUser}>Logout</Link>
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link>
          <span> | </span>
          <Link to="/register">Register</Link>
        </div>
      )}
      <hr />

      {user && <p>Welcome {user.username}.</p>}
    </div>
  );
};

export default Header;
