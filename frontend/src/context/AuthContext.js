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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    client.get("api/user/details/")
    .then(function(res) {
      setUser(res.data);
    })
    .catch(function(error) {
      console.log(error)
    })
    .finally(() => {
      setLoading(false); 
    });
  }, []);

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
      })
      .catch(function(error) {
        console.log(error)
      })
      .finally(() => {
        navigate("/")
      });
    });
  }

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

  let logoutUser = () => {
    client.post("api/user/logout/", {
      withCredentials: true
    })
    .then(function(res) {
      setUser(null)
    })
  }

  let contextData = {
    client: client,
    user: user,
    loginUser: loginUser,
    registerUser: registerUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
