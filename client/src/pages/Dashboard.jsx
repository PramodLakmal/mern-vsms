import {useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import CuAgentDashFeedback from '../components/CuAgentDashFeedback';
import DashUsers from '../components/DashUsers';
import AdminDashboardComponenet from '../components/AdminDashboardComponenet';
import DashCoupons from '../components/DashCoupons';
import DashMyAppointments from '../components/DashMyAppointments';
import DashPosts from '../components/DashPosts';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import Expenses from '../components/Expenses/Expenses';
import IncomeForm from '../components/Incomes/IncomeForm';
import Incomes from '../components/Incomes/Incomes';
import NetIncome from '../components/NetIncome';


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

    </div>
  )
}
