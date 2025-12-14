import "./navBar.scss";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { useNavigate } from "react-router-dom";
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/authContext';

const NavBar = () => {

  const {toggle, darkMode} = useContext(DarkModeContext);
  const { user, logout } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  let navigate = useNavigate();
  
  useEffect(() => {
    // derive logged-in state from AuthContext user
    setIsLoggedIn(!!user);
  }, [user]);

  // Debounced search function
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const createPage = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    let path = `/create`;
    navigate(path);
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // use AuthContext logout to update global state
      if (logout) logout();
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Nerve</span>
        </Link>
        {/*<HomeOutlinedIcon/>*/}
        {darkMode ? <WbSunnyOutlinedIcon onClick={toggle}/> : <DarkModeOutlinedIcon onClick={toggle}/>}
        {/*<GridViewOutlinedIcon/>*/}
        <AddBoxOutlinedIcon onClick={createPage}/>
        <div className="search">
          <SearchOutlinedIcon onClick={handleSearchSubmit} style={{ cursor: 'pointer' }} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
          />
        </div>

      </div>
      <div className="right">
        <PersonOutlinedIcon onClick={() => navigate(`/profile/${user._id}`)} style={{cursor: 'pointer'}}/>
        {/*<EmailOutlinedIcon/>*/}
        <NotificationsOutlinedIcon/>
        {/*
        <div className="user">
          <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt=""/>
          <span>John Doe</span>
        </div>
        */}
        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button className="login-btn">Login</button>
          </Link>
        )}
      </div>  
    </div>
  )
}

export default NavBar;
