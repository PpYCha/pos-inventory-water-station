import React, { useEffect } from "react";

const Customer = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return <div>Customer</div>;
};

export default Customer;
