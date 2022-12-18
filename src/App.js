import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import "./index.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useValue } from "./context/ContextProvider";

const App = () => {
  const {
    state: { currentUser },
  } = useValue();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Signin />} />
          <>
            {currentUser === null ? null : (
              <Route path="dashboard/*" element={<Dashboard />} />
            )}
          </>
        </Routes>
      </BrowserRouter>
    </>
  );
};
//testaskdfjla
export default App;
