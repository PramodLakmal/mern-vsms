import {useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import CuAgentDashFeedback from '../components/CuAgentDashFeedback';
import DashUsers from '../components/DashUsers';
import AdminDashboardComponenet from '../components/AdminDashboardComponenet';
import AddEmployee from '../components/employee/AddEmployee';
import AddLeave from '../components/leave/AddLeave';
import LeaveList from '../components/leave/LeaveList';
import EmployeeList from '../components/employee/EmployeeList';
import SalaryList from '../components/salary/SalaryList';
import AddSalary from '../components/salary/AddSalary';
import DashCoupons from '../components/DashCoupons';
import DashMyAppointments from '../components/DashMyAppointments';
import DashPosts from '../components/DashPosts';
import DashNotice from '../components/DashNotice';
import DashItemRequest from '../components/supplier/DashItemRequest';
import AddSupplier from '../components/supplier/AddSupplier';
import SupplierList from '../components/supplier/SupplierList';

import ItemRequest from '../../../api/models/itemRequest.model';


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
        {/* Sidebar */}
      </div> 

      {/* Posts/products.... */} 
      {tab === 'posts' && <DashPosts/>}
      {/* Profile.... */} 
      {tab === 'profile' && <DashProfile/>}
      {/* CuAgentFeedbacks.... */}
      {tab === 'feedbacks' && <CuAgentDashFeedback/>}
      {/* User List.... */}
      {tab === 'users' && <DashUsers/>}
      {/* Admin Dashboard */}
      {tab === 'dash' && <AdminDashboardComponenet/>}
      {/* Add Employee */}
      {tab === 'AddEmployee' && <AddEmployee/>}
      {/* Employee List */}
      {tab === 'EmployeeList' && <EmployeeList/>}
      {/* Add Leave */}
      {tab === 'AddLeave' && <AddLeave/>}
      {/* Leave List */}
      {tab === 'LeaveList' && <LeaveList/>}
      {/* Add Salary */}
      {tab === 'AddSalary' && <AddSalary/>}
      {/* Salary List */}
      {tab === 'SalaryList' && <SalaryList/>}
      {/* coupons */}
      {tab === "coupons" && <DashCoupons />}
      {/* My Appointments */}
      {tab === 'myAppointments' && <DashMyAppointments/>}
      {/* Notice List */}
      {tab === 'notices' && <DashNotice/>}
      {/* Item Request List */}
      {tab === 'itemRequests' && <DashItemRequest/>}
       {/* Add Supplier */}
       {tab === 'AddSupplier' && <AddSupplier/>}
      {/* Supplier List */}
      {tab === 'SupplierList' && <SupplierList/>}
      {/* Request items */}
      {tab === 'itemRequest' && <ItemRequest/>}
    
    
      
    </div>
  )
}
