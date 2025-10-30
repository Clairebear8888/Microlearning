import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../src/config/api.config";
const AuthContext = createContext();

const AuthContextWrapper = ({ children }) => {
  const [currentUser, setcurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsloggedIn] = useState(false);
  const nav = useNavigate();

  function handleLogOut() {
    localStorage.removeItem("authTocken");
    nav("/login");
    setcurrentUser({});
    setIsLoading(false);
    setIsloggedIn(false);
  }

  async function authtenticateUser() {
    const theToken = localStorage.getItem("authToken");

    try {
      const { data } = await axios.get(`${API_URL}/auth/verify`, {
        headers: { authorization: `Bearer ${theToken}` },
      });
      console.log("token valid! You are verifed", data);
      setcurrentUser(data.currentUser);
      setIsLoading(false);
      setIsloggedIn(true);
    } catch (err) {
      console.log(err);
      setcurrentUser({});
      setIsLoading(false);
      setIsloggedIn(false);
    }
  }
  useEffect(() => {
    authtenticateUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isLoggedIn,
        authtenticateUser,
        handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextWrapper };
