import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export default AuthContext;

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "https://api.gym-together.com/",
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userFriends, setUserFriends] = useState(null);
  const [loading, setLoading] = useState(true);

  // get user data everytime the user refreshes the page
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDetailsResponse = await client.get("api/user/details/");
        setUser(userDetailsResponse.data);
        setUserFriends(userDetailsResponse.data.friends);
      } catch (error) {
        // console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // login the user and then gets the user data
  let loginUser = async (email, password) => {
    try {
      await client.post("api/user/login/", {
        email: email,
        password: password,
      });

      // assuming login was successful, fetch user details
      let userDetailsResponse = await client.get("api/user/details/");
      setUser(userDetailsResponse.data);
      setUserFriends(userDetailsResponse.data.friends);
    } catch (error) {
      // console.error("Error during login:", error);
      throw new Error("Login failed. Please check your email and password and try again.");
    }
  };

  // registers the user, login the user, and then gets the user data
  const registerUser = async (username, email, password) => {
    try {
      await client.post("api/user/register/", {
        username: username,
        email: email,
        password: password,
      });

      // Login the user after successful registration
      await loginUser(email, password);
    } catch (error) {
      // console.error("Error during registration:", error);
      throw error;
    }
  };

  // logout the user
  const logoutUser = async () => {
    try {
      await client.post("api/user/logout/");
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // context data that will be use in my pages
  const contextData = {
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
