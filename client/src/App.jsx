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

//IT22589590
import AddEmployee from "./pages/employee/AddEmployee";
import AddLeave from "./pages/leave/AddLeave";
import AssignSalary from "./pages/salary/AssignSalary";
import EmployeeList from "./pages/employee/EmployeeList";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />} > {/* PrivateRoute is a placeholder */}
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/services" element={<Services />} />

        {/*IT22589590*/}
        <Route path="/addemployee" element={<AddEmployee />} />
        <Route path="/employeelist" element={<EmployeeList />} />
        <Route path="/addleave" element={<AddLeave />} />
        <Route path="/assignsalary" element={<AssignSalary />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
