import React, { useEffect } from "react";

const Stock = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  return <div>Stock</div>;
};

export default Stock;
