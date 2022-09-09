import { useEffect } from "react";

const Reports = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return <div>Reports</div>;
};

export default Reports;
