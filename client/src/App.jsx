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
import UpdateLeave from "./components/leave/UpdateLeave";
import UpdateSalary from "./components/salary/UpdateSalary";
import UpdateEmployee from "./components/employee/UpdateEmployee";
import ViewLeave from "./components/leave/ViewLeave";
import ViewSalary from "./components/salary/ViewSalary";
import ViewEmployee from "./components/employee/ViewEmployee";





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
<<<<<<< HEAD
        <Route element={<PrivateRoute />}> {/* PrivateRoute is a placeholder */}
        <Route path="/dashboard" element={<Dashboard />} />

        
        <Route path="/updateleave/:id" element={<UpdateLeave />} />
        
        <Route path="/updatesalary/:id" element={<UpdateSalary />} />
        
       
        </Route>
        <Route path="/services" element={<Services />} />
        <Route path="/ViewLeave/:id" element={<ViewLeave />} />
        <Route path="/ViewSalary/:id" element={<ViewSalary />} />
        <Route path="/ViewEmployee/:employeeId" element={<ViewEmployee />} />
        
       
        
        <Route path="/UpdateEmployee/:employeeId" element={<UpdateEmployee />} />

        
        
       
        
        
       
       
=======
        <Route element={<PrivateRoute />} > {/* PrivateRoute is a placeholder */}
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/services" element={<Services />} />

        {/*IT22589590*/}
        <Route path="/addemployee" element={<AddEmployee />} />
        <Route path="/employeelist" element={<EmployeeList />} />
        <Route path="/addleave" element={<AddLeave />} />
        <Route path="/assignsalary" element={<AssignSalary />} />

>>>>>>> e21e889a364af2b57d90422cb8eeacde0e123907
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
