import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import BookNow from "./pages/Book";
import Inventory from "./pages/Inventory";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Services from "./pages/Services";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import UpdateLeave from "./components/leave/UpdateLeave";
import UpdateSalary from "./components/salary/UpdateSalary";
import UpdateEmployee from "./components/employee/UpdateEmployee";
import ViewLeave from "./components/leave/ViewLeave";
import ViewSalary from "./components/salary/ViewSalary";
import ViewEmployee from "./components/employee/ViewEmployee";
import Feedback from "./pages/Feedback";
import PaymentSuccess from "./pages/PaymentSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import PostPage from "./pages/PostPage";
import Search from "./pages/Search";
import CashierDash from "./pages/cashier/Dashboard";
import DashServices from "./components/Services/DashServices"; // Adjust the import path as necessary
import UpdateService from "./components/Services/UpdateService";
import Updateemergencyservices from "./components/EmergencyService/Updateemergencyservices";


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          {" "}
          {/* PrivateRoute is a placeholder */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="/feedbackSuccess">"Feedback Success"</Route>
        
          <Route path="/updateleave/:id" element={<UpdateLeave />} />
          <Route path="/updatesalary/:id" element={<UpdateSalary />} />

          <Route path="/dash-services" element={<DashServices />} />
          <Route path="/update-service/:serviceId" element={<UpdateService />} />
          <Route path="/Updateemergencyservices/:emergencyId"element={<Updateemergencyservices/>} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>

        <Route element={<OnlyAdminPrivateRoute />}>
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:postId" element={<UpdatePost />} />
        <Route path="/cashierDashboard" element={<CashierDash />} />
        </Route>
        <Route path="post/:postSlug" element={<PostPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/book" element={<BookNow />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/ViewLeave/:id" element={<ViewLeave />} />
        <Route path="/ViewSalary/:id" element={<ViewSalary />} />
        <Route path="/ViewEmployee/:employeeId" element={<ViewEmployee />} /> 
        <Route path="/UpdateEmployee/:employeeId" element={<UpdateEmployee />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
