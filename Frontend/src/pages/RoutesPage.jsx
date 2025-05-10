import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Signup from "../component/Signup";
import Login from "../component/Login";
import AdminLogin from "../component/Admin/AdminLogin";
import AdminDashboard from "../component/Admin/AdminDashboard";
import Mainpage from "./Mainpage";
import Home from "../component/Home";
import CampaignTable from "../component/CampaignTable";
import ErrorPage from "../component/ErrorPage";
import Campaign from "../component/Campaign";
import ReadReport from "../component/ReadReport";
import Readmainpage from "./Readmainpage";
import Clickmainpage from "./Clickmainpage";
import Clicksinglemainpage from "./Clicksinglemainpage";
import TemMainpage from "./TemMainpage";
import Birthdayeditor from "./Birthdayeditor";
import Paymenteditor from "./Paymenteditor";
import RemainderTable from "../component/RemainderTable";
import Readreportremainder from "../component/Readreportremainder";
import NoInternet from "../component/NoInternet"; // Import NoInternet
import Forgetpassword from "../component/Forgetpassword";
import Verifyotp from "../component/Verifyotp";
import Resetpasswords from "../component/Resetpassword";
import Frontpageroute from "./Frontpageroute";
import Form from "../component/Frontpage/Form";
import AdminUserform from "../component/Admin/AdminUserform";

function RoutesPage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return <NoInternet />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-login" element={<Login />} />
        <Route path="/" element={<Frontpageroute />} />
        <Route path="/user-enroll" element={<AdminUserform />} />
        <Route path="/register-form" element={<Form/>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/editor" element={<Mainpage />} />
        <Route path="/read-editor/:userId/:campaignId" element={<Readmainpage />} />
        <Route path="/click-editor/:userId/:campaignId" element={<Clickmainpage />} />
        <Route path="/clicksingle-editor/:userId/:campaignId" element={<Clicksinglemainpage />} />
        <Route path="/home" element={<Home />} />

        <Route path="/campaigntable" element={<CampaignTable />} />
        <Route path="/campaign" element={<Campaign />} />
        <Route path="/TemMainpage" element={<TemMainpage />} />
        <Route path="/birthdayedit" element={<Birthdayeditor />} />
        <Route path="/paymentedit" element={<Paymenteditor />} />
        <Route path="/remaindertable" element={<RemainderTable />} />
        <Route path="/forgetpassword" element={<Forgetpassword />} /> 
        <Route path="/verifyotp" element={<Verifyotp />} /> 
        <Route path="/resetpassword" element={<Resetpasswords />} /> 
        <Route path="/readreport/:userId/:campaignId" element={<ReadReport />} />
        <Route path="/readreportremainder/:userId/:campaignId" element={<Readreportremainder />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default RoutesPage;
