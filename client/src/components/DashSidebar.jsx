import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
  HiUserGroup,
  HiOutlineClock,
  HiOutlineCalculator,
  HiChevronRight,
  HiChevronDown,
  HiPlusCircle,
  HiViewList,
  HiOutlineArchive,
  HiCurrencyDollar,
  HiBookmark,
  HiDocumentDuplicate,
  HiLocationMarker,
  HiBookOpen,
  HiInformationCircle,
  HiOutlineEmojiHappy,
  HiBookmarkAlt,
  HiOutlineViewBoards,
  HiShieldCheck
} from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RiCoupon2Fill, RiNotification4Fill } from "react-icons/ri";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Get the navigate function from react-router-dom
  const [tab, setTab] = useState("");
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false); // State for employee submenu visibility
  const [isSalaryOpen, setIsSalaryOpen] = useState(false); // State for salary submenu visibility
  const [isServiceOpen, setIsServiceOpen] = useState(false); // State for salary submenu visibility
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false); // State for expense submenu visibility
  const [isIncomeOpen, setIsIncomeOpen] = useState(false); // State for income submenu visibility
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleEmployeeSubmenu = () => setIsEmployeeOpen(!isEmployeeOpen);
  const toggleSalarySubmenu = () => setIsSalaryOpen(!isSalaryOpen);
  const toggleServiceSubmenu = () => setIsServiceOpen(!isServiceOpen);
  const toggleEmergencySubmenu = () => setIsEmergencyOpen(!isEmergencyOpen);
  const toggleExpenseSubmenu = () => setIsExpenseOpen(!isExpenseOpen); // Define toggle function for expense submenu
  const toggleIncomeSubmenu = () => setIsIncomeOpen(!isIncomeOpen); // Define toggle function for income submenu


  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <div>
            {currentUser.isAdmin && (
              <Link to="/dashboard?tab=dash">
                <Sidebar.Item
                  active={tab === "dash" || !tab}
                  icon={HiChartPie}
                  as="div"
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
            )}
          </div>
          <div>
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={
                  currentUser.isAdmin
                    ? "Admin"
                    : currentUser.isCustomerServiceAgent
                      ? "CuAgent"
                      : currentUser.isFinanceManager
                        ? "FManager"
                        : currentUser.isEmployee
                          ? "Emp"
                          : "User"
                }
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
          </div>

          {!currentUser.isAdmin && !currentUser.isCashier && !currentUser.isFinanceManager && !currentUser.isCustomerServiceAgent && (
            <div>
              <Link to="/dashboard?tab=myAppointments">
                <Sidebar.Item
                  active={tab === "myAppointments"}
                  icon={HiDocumentText}
                  as="div"
                >
                  My Appointments
                </Sidebar.Item>
              </Link>
            </div>
          )}

          <div>

            {currentUser.isEmployee && (
              <>
              <Link to="/dashboard?tab=ProfileView">
                <Sidebar.Item
                  active={tab === "ProfileView"}
                  icon={HiUserGroup}
                >
                  Employee List
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=AddLeave">
                <Sidebar.Item
                  active={tab === "AddLeave"}
                  icon={HiOutlineClock}
                >
                  Add Leave
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=ViewStatus">
                <Sidebar.Item
                  active={tab === "ViewStatus"}
                  icon={HiViewList}
                >
                  Leave List
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=Salary">
                <Sidebar.Item
                  active={tab === "Salary"}
                  icon={HiCurrencyDollar}
                >
                  Salary List
                </Sidebar.Item>
              </Link>
              </>
            )}
          </div>

          <div>

            {currentUser.isCustomerServiceAgent && (
              <Link to="/dashboard?tab=feedbacks">
                <Sidebar.Item
                  active={tab === "feedbacks"}
                  icon={HiDocumentText}
                  as="div"
                >
                  Feedbacks
                </Sidebar.Item>
              </Link>


            )}
          </div>

          <div>

            {currentUser.isCustomerServiceAgent && (
              <Link to="/dashboard?tab=Addemergencyservices">
                <div className="cursor-pointer">
                  <Sidebar.Item active={tab === "Addemergencyservices"} icon={HiPlusCircle}>
                    New Emergency
                  </Sidebar.Item>
                </div>
              </Link>


            )}
          </div>

          <div>
            {currentUser.isAdmin && (
              <>
                <Link to="/dashboard?tab=users">
                  <Sidebar.Item
                    active={tab === "users"}
                    icon={HiOutlineUserGroup}
                    as="div"
                  >
                    View Users
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=products">
                  <Sidebar.Item
                    active={tab === "products"}
                    icon={HiOutlineArchive}
                    as="div"
                  >
                    Products
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=coupons">
                  <Sidebar.Item
                    active={tab === "coupons"}
                    icon={RiCoupon2Fill}
                    as="div"
                  >
                    Coupons
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=notices">
                  <Sidebar.Item
                    active={tab === "notices"}
                    icon={RiNotification4Fill}
                    as="div"
                  >
                    Notice
                  </Sidebar.Item>
                </Link>
                <div className="relative">
                  <div
                    onClick={toggleEmployeeSubmenu} // Toggle employee submenu on click
                    className="flex items-center cursor-pointer"
                  >
                    <Sidebar.Item
                      active={tab === "AddEmployee"}
                      icon={HiUserGroup}
                      as="div"
                    >
                      Employee
                    </Sidebar.Item>
                    {isEmployeeOpen ? (
                      <HiChevronDown className="ml-2" />
                    ) : (
                      <HiChevronRight className="ml-2" />
                    )}
                  </div>
                  {isEmployeeOpen && ( // Conditionally render employee submenu items
                    <div className="absolute top-full left-0 mt-2 bg-gray-100 rounded py-1 px-2 z-10">
                      <Link to="/dashboard?tab=AddEmployee">
                        <Sidebar.Item
                          active={tab === "AddEmployee"}
                          icon={HiPlusCircle}
                          as="div"
                        >
                          New Employee
                        </Sidebar.Item>
                      </Link>
                      <Link to="/dashboard?tab=EmployeeList">
                        <Sidebar.Item
                          active={tab === "EmployeeList"}
                          icon={HiViewList}
                          as="div"
                        >
                          Employee List
                        </Sidebar.Item>
                      </Link>
                    </div>
                  )}
                </div>


                <div>

                  {currentUser.isAdmin && (
                    <Link to="/dashboard?tab=LeaveList">
                      <Sidebar.Item
                        active={tab === "LeaveList"}
                        icon={HiViewList}
                      >
                        Leave List
                      </Sidebar.Item>
                    </Link>
                  )}
                </div>


                <div className="relative">
                  <div onClick={toggleServiceSubmenu} className="flex items-center cursor-pointer">
                    <Sidebar.Item active={tab === "Addservices"} icon={HiUserGroup} as="div">
                      Service
                    </Sidebar.Item>
                    {isServiceOpen ? (
                      <HiChevronDown className="ml-2" />
                    ) : (
                      <HiChevronRight className="ml-2" />
                    )}
                  </div>
                  {isServiceOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-gray-100 rounded py-1 px-2 z-10">
                      <Link to="/dashboard?tab=Addservices">
                        <Sidebar.Item active={tab === "Addservices"} icon={HiPlusCircle} as="div">
                          New Service
                        </Sidebar.Item>
                      </Link>
                      <Link to="/dashboard?tab=DashServices">
                        <Sidebar.Item active={tab === "DashServices"} icon={HiViewList} as="div">
                          Service List
                        </Sidebar.Item>
                      </Link>
                    </div>
                  )}
                </div>
                <Link to="/dashboard?tab=Dashemergency">
                  <div className="cursor-pointer">
                    <Sidebar.Item active={tab === "Dashemergency"} icon={HiViewList}>
                      Emergency List
                    </Sidebar.Item>
                  </div>
                </Link>

              </>
            )}

          </div>

          {currentUser.isFinanceManager && (

            <>
              <div
                onClick={toggleSalarySubmenu} // Toggle salary submenu on click
                className="flex items-center cursor-pointer"
              >
                <Sidebar.Item
                  active={tab === "AddSalary"}
                  icon={HiOutlineCalculator}
                  as="div"
                >
                  Salary
                </Sidebar.Item>
                {isSalaryOpen ? (
                  <HiChevronDown className="ml-2" />
                ) : (
                  <HiChevronRight className="ml-2" />
                )}
              </div>

              {isSalaryOpen && ( // Conditionally render salary submenu items
                <div className="relative">
                  <div className="absolute top-full left-0 mt-2 bg-gray-100 rounded py-1 px-2 z-10">
                    <Link to="/dashboard?tab=AddSalary">
                      <Sidebar.Item
                        active={tab === "AddSalary"}
                        icon={HiPlusCircle}
                      >
                        New Salary
                      </Sidebar.Item>
                    </Link>
                    <Link to="/dashboard?tab=SalaryList">
                      <Sidebar.Item
                        active={tab === "SalaryList"}
                        icon={HiViewList}
                      >
                        Salary List
                      </Sidebar.Item>
                    </Link>
                  </div>
                </div>
              )}
              <div className="relative">
                <div
                  onClick={toggleExpenseSubmenu} // Toggle expense submenu on click
                  className="flex items-center cursor-pointer"
                >
                  <Sidebar.Item
                    active={tab === "AddExpense"}
                    icon={HiCurrencyDollar}
                    as="div"
                  >
                    Expenses
                  </Sidebar.Item>
                  {isExpenseOpen ? (
                    <HiChevronDown className="ml-2" />
                  ) : (
                    <HiChevronRight className="ml-2" />
                  )}
                </div>
                {isExpenseOpen && ( // Conditionally render expense submenu items
                  <div className="absolute top-full left-0 mt-2 bg-gray-100 rounded py-1 px-2 z-10">
                    <Link to="/dashboard?tab=ExpenseForm">
                      <Sidebar.Item
                        active={tab === "ExpenseForm"}
                        icon={HiPlusCircle}
                      >
                        Add Expense
                      </Sidebar.Item>
                    </Link>
                    <Link to="/dashboard?tab=Expenses">
                      <Sidebar.Item
                        active={tab === "Expenses"}
                        icon={HiViewList}
                      >
                        Expense List
                      </Sidebar.Item>
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative">
                <div
                  onClick={toggleIncomeSubmenu} // Toggle income submenu on click
                  className="flex items-center cursor-pointer"
                >
                  <Sidebar.Item
                    active={tab === "AddIncome"}
                    icon={HiCurrencyDollar}
                    as="div"
                  >
                    Incomes
                  </Sidebar.Item>
                  {isIncomeOpen ? (
                    <HiChevronDown className="ml-2" />
                  ) : (
                    <HiChevronRight className="ml-2" />
                  )}
                </div>
                {isIncomeOpen && ( // Conditionally render income submenu items
                  <div className="absolute top-full left-0 mt-2 bg-gray-100 rounded py-1 px-2 z-10">
                    <Link to="/dashboard?tab=IncomeForm">
                      <Sidebar.Item
                        active={tab === "IncomeForm"}
                        icon={HiPlusCircle}
                      >
                        Add Income
                      </Sidebar.Item>
                    </Link>
                    <Link to="/dashboard?tab=Incomes">
                      <Sidebar.Item
                        active={tab === "Incomes"}
                        icon={HiViewList}
                      >
                        Income List
                      </Sidebar.Item>
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/dashboard?tab=NetIncome">
                <Sidebar.Item
                  active={tab === "NetIncome"}
                  icon={HiCurrencyDollar}
                  as="div"
                >
                  Net Income
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=IncomeChart">
                <Sidebar.Item
                  active={tab === "IncomeChart"}
                  icon={HiOutlineClock}
                  as="div"
                >
                  Chart
                </Sidebar.Item>
              </Link>
</>

          )}
          <div>
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              onClick={handleSignout}
            >
              Sign Out
            </Sidebar.Item>
          </div>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}