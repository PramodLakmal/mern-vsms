import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import DashSidebar from "../../components/cashier/DashSidebar";
import DashCart from "../../components/cashier/DashCart";
import DashAppointments from "../../components/cashier/DashAppointments";
import DashTransactions from "../../components/cashier/DashTransactions";
import DashRefunds from "../../components/cashier/DashRefunds";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="">
        <DashSidebar />
      </div>
      {/* cart */}
      {tab === "cart" && <DashCart />}
      {/* appointments */}
      {tab === "appointments" && <DashAppointments/>}
      {/* transactions */}
      {tab === "transactions" && <DashTransactions />}
      {/* refunds */}
      {tab === "refunds" && <DashRefunds />}
    </div>
  );
}
