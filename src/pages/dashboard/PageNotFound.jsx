import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      localStorage.removeItem("waterUser");
      navigate("/");
    }, 2000);
  }, []);

  return <div>Page Not Found Redirecting to Login</div>;
};

export default PageNotFound;
