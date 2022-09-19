import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/Home";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
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
