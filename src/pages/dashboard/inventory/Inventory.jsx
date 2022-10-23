import React, { useEffect } from "react";

const Inventory = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return <div>Inventory</div>;
};

export default Inventory;
