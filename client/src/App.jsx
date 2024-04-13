import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Services from "./pages/Services";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

// Import the missing components
import AddEmployee from "./pages/employee/AddEmployee";
import AddLeave from "./pages/leave/AddLeave";
import AssignSalary from "./pages/salary/AssignSalary";
import EmployeeList from "./pages/employee/EmployeeList";
import ViewLeave from "./pages/leave/ViewLeave";
import ViewSalary from "./pages/salary/ViewSalary";
import ViewEmployee from "./pages/employee/ViewEmployee";
import UpdateEmployee from "./pages/employee/UpdateEmployee";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Private routes */}
        <PrivateRoute path="/services" element={<Services />} />
        <PrivateRoute path="/viewleave/:id" element={<ViewLeave />} />
        <PrivateRoute path="/viewsalary/:id" element={<ViewSalary />} />
        <PrivateRoute path="/viewemployee/:employeeId" element={<ViewEmployee />} />
        <PrivateRoute path="/updateemployee/:employeeId" element={<UpdateEmployee />} />

        {/* IT22589590 */}
        <PrivateRoute path="/addemployee" element={<AddEmployee />} />
        <PrivateRoute path="/employeelist" element={<EmployeeList />} />
        <PrivateRoute path="/addleave" element={<AddLeave />} />
        <PrivateRoute path="/assignsalary" element={<AssignSalary />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
