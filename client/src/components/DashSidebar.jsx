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
} from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RiCoupon2Fill } from "react-icons/ri";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Get the navigate function from react-router-dom
  const [tab, setTab] = useState("");
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false); // State for employee submenu visibility
  const [isLeaveOpen, setIsLeaveOpen] = useState(false); // State for leave submenu visibility
  const [isSalaryOpen, setIsSalaryOpen] = useState(false); // State for salary submenu visibility
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
  const toggleLeaveSubmenu = () => setIsLeaveOpen(!isLeaveOpen);
  const toggleSalarySubmenu = () => setIsSalaryOpen(!isSalaryOpen);

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <div className="">
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
                      : "User"
                }
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>

            <Link to="/dashboard?tab=myAppointments">
              <Sidebar.Item
                active={tab === "myAppointments"}
                icon={HiDocumentText}
                as="div"
              >
                My Appointments
              </Sidebar.Item>
            </Link>

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
                <Link to="/dashboard?tab=coupons">
                  <Sidebar.Item
                    active={tab === "coupons"}
                    icon={RiCoupon2Fill}
                    as="div"
                  >
                    Coupons
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
                    <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded py-1 px-2 z-10">
                      <Link to="/dashboard?tab=AddEmployee">
                        <Sidebar.Item
                          active={tab ==="AddEmployee"}
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

                <div className="relative">
                  <div
                    onClick={toggleLeaveSubmenu} // Toggle leave submenu on click
                    className="flex items-center cursor-pointer"
                  >
                    <Sidebar.Item
                      active={tab === "AddLeave"}
                      icon={HiOutlineClock}
                      as="div"
                    >
                      Leave
                    </Sidebar.Item>
                    {isLeaveOpen ? (
                      <HiChevronDown className="ml-2" />
                    ) : (
                      <HiChevronRight className="ml-2" />
                    )}
                  </div>
                  {isLeaveOpen && ( // Conditionally render leave submenu items
                    <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded py-1 px-2 z-10">
                      <Link to="/dashboard?tab=AddLeave">
                        <Sidebar.Item
                          active={tab === "AddLeave"}
                          icon={HiPlusCircle}
                        >
                          Add Leave
                        </Sidebar.Item>
                      </Link>
                      <Link to="/dashboard?tab=LeaveList">
                        <Sidebar.Item
                          active={tab === "LeaveList"}
                          icon={HiViewList}
                        >
                          Leave List
                        </Sidebar.Item>
                      </Link>
                     
                    </div>
                  )}
                </div>

                <div className="relative">
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
                    <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded py-1 px-2 z-10">
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
                  )}
                </div>
              </>
            )}
          </div>

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
