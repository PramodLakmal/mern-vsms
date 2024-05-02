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
import Feedback from "./pages/Feedback";
import PaymentSuccess from "./pages/PaymentSuccess";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import PostPage from "./pages/PostPage";
import Search from "./pages/Search";

import UpdateIncome from "./components/Incomes/UpdateIncome";
import UpdateExpense from "./components/Expenses/UpdateExpense";
import NetIncome from "./components/NetIncome";

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
        </Route>

        <Route element={<OnlyAdminPrivateRoute />}>
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="post/:postSlug" element={<PostPage />} />

        <Route path="services" element={<Services />} />
        <Route path="/book" element={<BookNow />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route path="/UpdateIncome/:id" element={<UpdateIncome/>} />
        <Route path="/UpdateExpense/:id" element={<UpdateExpense/>} />
        <Route path="/NetIncome" element={<NetIncome/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
