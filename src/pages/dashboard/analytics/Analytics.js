import { useEffect } from "react";

const Analytics = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return <div>Analytics</div>;
};

export default Analytics;
