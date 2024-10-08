import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUser from "../components/DashUser";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        {" "}
        {/*sidebar.  */}
        <DashSidebar />
      </div>

      {/*profile.  */}
      {tab === "profile" && <DashProfile />}

      {tab === "posts" && <DashPosts />}

      {tab === "users" && <DashUser />}

      {tab === "comments" && <DashComments />}

      {tab === "dash" && <DashboardComp />}
      {(!tab || !["profile", "posts", "users", "comments","dash"].includes(tab)) && (
        <DashboardComp />
      )}
    </div>
  );
}

export default Dashboard;
