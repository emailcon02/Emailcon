import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "../../component/Login-Options/Login";
import AdminLogin from "../../component/Admin/AdminLogin";
import Mainpage from "../Mainpage";
import Home from "../../component/Campaign-Creation/Home";
import CampaignTable from "../../component/Campaign-Creation/CampaignTable";
import ErrorPage from "../../component/Campaign-Creation/ErrorPage";
import Campaign from "../../component/Campaign-Creation/Campaign";
import ReadReport from "../../component/Campaign-Creation/ReadReport";
import Readmainpage from "../Readmainpage";
import Clickmainpage from "../Clickmainpage";
import Clicksinglemainpage from "../Clicksinglemainpage";
import TemMainpage from "../TemMainpage";
import Birthdayeditor from "../Birthdayeditor";
import Paymenteditor from "../Paymenteditor";
import RemainderTable from "../../component/Campaign-Creation/RemainderTable";
import Readreportremainder from "../../component/Campaign-Creation/Readreportremainder";
import NoInternet from "../../component/Campaign-Creation/NoInternet"; // Import NoInternet
import Forgetpassword from "../../component/Login-Options/Forgetpassword";
import Verifyotp from "../../component/Login-Options/Verifyotp";
import Resetpasswords from "../../component/Login-Options/Resetpassword";
import Frontpageroute from "./Frontpageroute";
import Form from "../../component/Frontpage/Form";
import PaymentPage from "../../component/Login-Options/PaymentPage";
import SignupOption from "../../component/Login-Options/SignupOption";
import UserPaymenthistory from "../../component/Admin/UserPaymenthistory";
import Smtppage from "../../component/Login-Options/Smtppage";
import Createusers from "../../component/Admin/Createusers";
import AllUserPaymenthistory from "../../component/Admin/AlluserPaymenthistory";
import DashboardPage from "../../component/Admin/DashboardPage";
import SubAdminDashboardPage from "../../component/Sub-Admin/DashboardPage";
import SubAdminUserDetail from "../../component/Sub-Admin/UserDetail";
import SubAdminExpiredUser from "../../component/Sub-Admin/ExpiredUser";
import SubAdminUserPaymenthistory from "../../component/Sub-Admin/UserPaymenthistory";
import SubAdminAllUserPaymenthistory from "../../component/Sub-Admin/AllUserPaymenthistory";
import SubUserRequestForm from "../../component/Sub-Admin/UserRequestForm";
import UserDetail from "../../component/Admin/UserDetail";
import ExpiredUser from "../../component/Admin/ExpiredUser";
import UserRequestForm from "../../component/Admin/UserRequestForm";
import Signup from "../../component/Login-Options/Signup";
import UserDemoRequest from "../../component/Business-Admin/UserDemoRequest";

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
        <Route path="/user-enroll" element={<UserRequestForm />} />
        <Route path="/signup-option/:userId" element={<SignupOption />} />
        <Route path="/admin-user-create" element={<Createusers />} />
        <Route path="/business-admin-dashboard" element={<UserDemoRequest />} />
        <Route path="/smtppage" element={<Smtppage />} />   
        <Route path="/userpayment/:userId" element={<PaymentPage/>} />
        <Route path="/user-payment-history/:userId" element={<UserPaymenthistory/>} />
        <Route path="/all-user-payment-history" element={<AllUserPaymenthistory/>} />
        <Route path="/register-form" element={<Form/>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-detail" element={<UserDetail />} />
        <Route path="/expired-users" element={<ExpiredUser />} />
        <Route path="/super-admin-dashboard" element={<DashboardPage/>} />
        <Route path="/sub-user-detail" element={<SubAdminUserDetail />} />
        <Route path="/sub-expired-users" element={<SubAdminExpiredUser />} />
        <Route path="/sub-user-payment-history/:userId" element={<SubAdminUserPaymenthistory />} />
        <Route path="/sub-all-user-payment-history" element={<SubAdminAllUserPaymenthistory />} />
        <Route path="/sub-admin-dashboard" element={<SubAdminDashboardPage/>} />
        <Route path="/sub-user-enroll" element={<SubUserRequestForm />} />
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
