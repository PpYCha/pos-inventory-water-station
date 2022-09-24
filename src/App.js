import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Login />} />
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
