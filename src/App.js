import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import "./index.css";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Signin />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="dashboard/*" element={<Dashboard />}>
            {/* <Route path="/" element={<Dashboard />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
//testaskdfjla
export default App;
