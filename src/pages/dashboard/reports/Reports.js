import { useEffect } from "react";

const Reports = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return (
    <div>
      <text>Hello</text>
      <br />
      <input></input>
      <br />
      <button>Hello</button>
    </div>
  );
};

export default Reports;
