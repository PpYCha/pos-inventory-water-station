import { useEffect } from "react";

const Products = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return <div>Products</div>;
};

export default Products;
