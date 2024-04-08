import {Sidebar} from 'flowbite-react';
import {HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiChartPie} from 'react-icons/hi';
import {Link, useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RiCoupon2Fill } from "react-icons/ri";




export default function DashSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const [tab, setTab] = useState('');
    const {currentUser} = useSelector((state) => state.user);
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if(tabFromUrl) {
        setTab(tabFromUrl);
      }
    }, [location.search]); 
    const handleSignout = async () => {
      try {
        const res = await fetch('/api/user/signout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        }else {
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
              <div className=''>
              {currentUser.isAdmin &&(
                <Link to='/dashboard?tab=dash'>
                <Sidebar.Item active={tab === 'dash' || !tab} icon={HiChartPie} as='div'>
                    Dashboard
                </Sidebar.Item> 
                </Link>   
                )}  
                </div> 

                <div>
                <Link to='/dashboard?tab=profile'>
                <Sidebar.Item active= {tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : currentUser.isCustomerServiceAgent ? 'CuAgent' : 'User'} labelColor='dark' as='div'>
                    Profile
                </Sidebar.Item>
                </Link>
                {currentUser.isCustomerServiceAgent &&(
                <Link to='/dashboard?tab=feedbacks'>
                <Sidebar.Item active= {tab === 'feedbacks'} icon={HiDocumentText} as='div'>
                    Feedbacks    
                </Sidebar.Item>
                </Link>
              )}
              </div>

              <div>
              {currentUser.isAdmin &&(
                <Link to='/dashboard?tab=users'>
                <Sidebar.Item active= {tab === 'users'} icon={HiOutlineUserGroup} as='div'>
                    View Users    
                </Sidebar.Item>
                </Link>
              )}
              </div>

              <Link to="/dashboard?tab=coupons">
                <Sidebar.Item
                  active={tab === "coupons"}
                  icon={RiCoupon2Fill}
                  as="div"
                >
                  Coupons
                </Sidebar.Item>
              </Link>

              <div>
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
                    Sign Out
                </Sidebar.Item>
                </div> 
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
