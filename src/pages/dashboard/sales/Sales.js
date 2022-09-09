import { useEffect } from "react";

const Sales = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return <div>Sales</div>;
};

export default Sales;
