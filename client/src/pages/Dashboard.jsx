import {useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';

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
      {/* Profile.... */} 
      {tab === 'profile' && <DashProfile/>}
      {/* Profile.... */}
    </div>
  )
}
