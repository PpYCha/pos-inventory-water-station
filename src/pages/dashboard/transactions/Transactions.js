import { useEffect } from "react";

const Transactions = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return <div>Transactions</div>;
};

export default Transactions;
