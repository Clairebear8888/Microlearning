import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

const RoutesProtector = ({ children }) => {
  console.log("this is insdie of route protector");
  const { isLoading, isLoggedIn } = useContext(AuthContext);
  if (isLoading) {
    return <p>Loading</p>;
  }

  if (isLoggedIn === false) {
    return <Navigate to="/login" />;
  }

  return <div>{children}</div>;
};

export default RoutesProtector;
