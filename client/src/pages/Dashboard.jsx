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
import DashProducts from '../components/DashProducts';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import Expenses from '../components/Expenses/Expenses';
import IncomeForm from '../components/Incomes/IncomeForm';
import Incomes from '../components/Incomes/Incomes';
import NetIncome from '../components/NetIncome';
import DashNotice from '../components/DashNotice';
import DashServices from "../components/Services/DashServices"; 
import Addemergencyservices from '../components/EmergencyService/Addemergencyservices'; // Correct
import Dashemergency from '../components/EmergencyService/Dashemergency';
import Addservices from '../components/Services/Addservices'


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
      {tab === 'products' && <DashProducts/>}
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
       {/* Add Expense */}
       {tab === 'ExpenseForm' && <ExpenseForm/>}
       {/* Expense List */}
       {tab === 'Expenses' && <Expenses/>}
       {/* Add Income */}
       {tab === 'IncomeForm' && <IncomeForm/>}
       {/* Expense List */}
       {tab === 'Incomes' && <Incomes/>}
        {/* Net Income Chart */}
        {tab === 'NetIncome' && <NetIncome/>}

      {/* Notice List */}
      {tab === 'notices' && <DashNotice/>}
      {tab === 'Addservices' && <Addservices/>}
      {tab === 'DashServices' && <DashServices/>}
      {tab === 'updateService' && <UpdateService />}
      {tab === 'Addemergencyservices'&& <Addemergencyservices/>}
      {tab === 'Dashemergency'&& <Dashemergency/>}
    
    
      
    </div>
  )
}
