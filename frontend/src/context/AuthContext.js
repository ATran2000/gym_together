import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export default AuthContext;

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userFriends, setUserFriends] = useState(null)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  // get user data everytime the user refreshes the page
  useEffect(() => {
    client.get("api/user/details/")
    .then(function(res) {
      setUser(res.data)
      setUserFriends(res.data.friends)
    })
    .catch(function(error) {
      console.log(error)
    })
    .finally(() => {
      setLoading(false); 
    });
  }, []);

  // login the user and then gets the user data
  let loginUser = async (e) => {
    e.preventDefault();

    client.post("api/user/login/", {
      email: e.target.email.value,
      password: e.target.password.value,
    })
    .then(function(res) {
      client.get("api/user/details/")
      .then(function(res) {
        setUser(res.data);
        setUserFriends(res.data.friends)
      })
      .catch(function(error) {
        console.log(error)
      })
      .finally(() => {
        navigate("/")
      });
    });
  }

  // registers the user, login the user, and then gets the user data
  let registerUser = async (e) => {
    e.preventDefault();

    client.post("api/user/register/", {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    })
    .then(function(res) {
      client.post("api/user/login/", {
        email: e.target.email.value,
        password: e.target.password.value,
      })
      .then(function(res) {
        client.get("api/user/details")
        .then(function(res) {
          setUser(res.data);
        })
        .catch(function(error) {
          console.log(error)
        })
        .finally(() => {
          navigate("/")
        });
      });
    })
  }

  // logout the user
  let logoutUser = () => {
    client.post("api/user/logout/", {
    })
    .then(function(res) {
      setUser(null)
    })
  }

  // context data that will be use in my pages
  let contextData = {
    client: client,
    user: user,
    userFriends: userFriends,
    setUserFriends: setUserFriends,
    loginUser: loginUser,
    registerUser: registerUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {/* makes sure to grab the user's data before it goes to any page */}
      {/* if not for this, the app thinks the user state is logged out and moves to the login screen*/}
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
