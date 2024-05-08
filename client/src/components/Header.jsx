import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useNavigate } from "react-router-dom";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.theme);

  const [searchTerm, setSearchTerm] = React.useState('');
  console.log(searchTerm);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
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
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  return (
    <Navbar className="border-b-2 flex">
      <div>
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className=" py-1">
            {theme === 'light' ? (
              <img src="https://firebasestorage.googleapis.com/v0/b/mern-vsms.appspot.com/o/Logo%20and%20Other%2FSighe%20Auto.png?alt=media&token=95f727f5-dfdf-4d56-be9e-b4eabd8cf42d" alt="logo" />
            ) : (
              <img src="https://firebasestorage.googleapis.com/v0/b/mern-vsms.appspot.com/o/Logo%20and%20Other%2FSighe%20Auto%20dark.png?alt=media&token=b477e968-c373-42dd-ae91-51d9551c406e" alt="dark-mode-logo" />
            )}
          </span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} >
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e)=> setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                @{currentUser.username}
              </span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>

            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>
                Profile
              </Dropdown.Item>
            </Link>
            {currentUser.isCashier && ( // Check if the user role is Cashier
              <Link to={'/cashierDashboard?tab=cart'}>
                <Dropdown.Item>
                  Dashboard
                </Dropdown.Item>
              </Link>
            )}
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>

          </Dropdown>
        ) :
          (
            <Link to="/sign-in">
              <Button gradientDuoTone="pinkToOrange" outline>
                Sign In
              </Button>
            </Link>
          )
        }
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse >
        <Navbar.Link className="mt-1" active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link className="mt-1" active={path === "/inventory"} as={"div"}>
          <Link to="/inventory">Inventory</Link>
        </Navbar.Link>
        <Navbar.Link className="mt-1" active={path === "/services"} as={"div"}>
          <Link to="/services">Services</Link>
        </Navbar.Link>
        <Navbar.Link className="mt-1" active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link className="mt-1" active={path === "/news"} as={"div"}>
          <Link to="/news">News</Link>
        </Navbar.Link>
        <Navbar.Link className="mt-1" active={path === "/contact"} as={"div"}>
          <Link to="/contact">Contact Us</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/book"} as={"div"}>
          <Link to="/book"><Button type='button' color='failure'>Book Now</Button></Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
