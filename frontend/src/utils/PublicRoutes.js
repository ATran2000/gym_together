import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";

const PublicRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    user ? (
      <Navigate to="/" /> 
    ) : ( 
      <Outlet/>
    )
  )
}

export default PublicRoutes;