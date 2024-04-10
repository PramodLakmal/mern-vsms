import React from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DashSidebar() {
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
    <Sidebar aria-label="Default sidebar example" className="h-screen">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/cashierDashboard?tab=cart">
            <Sidebar.Item icon={HiChartPie} active={tab === "cart" || !tab} as='div'>
              Cart
            </Sidebar.Item>
          </Link>
          <Link to="/cashierDashboard?tab=appointments">
          <Sidebar.Item
            icon={HiViewBoards}
            label="Pro"
            labelColor="dark"
            active={tab === "appointments"}
            as='div'
          >
            Reservations
          </Sidebar.Item>
          </Link>
          <Link to="/cashierDashboard?tab=transactions">
          <Sidebar.Item
            icon={HiViewBoards}
            active={tab === "transactions"}
            as='div'
          >
            Transactions
          </Sidebar.Item>
          </Link>

          <Link to="/cashierDashboard?tab=refunds">
          <Sidebar.Item
            icon={HiViewBoards}
            active={tab === "refunds"}
            as='div'
          >
            Refunds
          </Sidebar.Item>
          </Link>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
