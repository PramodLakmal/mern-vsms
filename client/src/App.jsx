import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import BookNow from "./pages/Book";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Services from "./pages/Services";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Feedback from "./pages/Feedback";
import PaymentSuccess from "./pages/PaymentSuccess";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          {" "}
          {/* PrivateRoute is a placeholder */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="/feedbackSuccess">"Feedback Success"</Route>
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="services" element={<Services />} />
        <Route path="/book" element={<BookNow />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
