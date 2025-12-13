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

const NavBar = () => {

  const {toggle, darkMode} = useContext(DarkModeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef(null);

  let navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Debounced search function
  const searchableList = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/posts/search?q=${encodeURIComponent(query)}`);
      const posts = await res.json();
      setSearchResults(Array.isArray(posts) ? posts : []);
      setShowDropdown(true);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced search (500ms delay)
    debounceTimer.current = setTimeout(() => {
      searchableList(query);
    }, 500);
  };

  const handleSelectPost = (postId) => {
    navigate(`/post/${postId}`);
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
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
      localStorage.removeItem('token');
      setIsLoggedIn(false);
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
        <HomeOutlinedIcon/>
        {darkMode ? <WbSunnyOutlinedIcon onClick={toggle}/> : <DarkModeOutlinedIcon onClick={toggle}/>}
        {/*<GridViewOutlinedIcon/>*/}
        <AddBoxOutlinedIcon onClick={createPage}/>
        <div className="search">
          <SearchOutlinedIcon/>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {showDropdown && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map(post => (
                <div
                  key={post._id}
                  onClick={() => handleSelectPost(post._id)}
                >
                  <strong>{post.title}</strong>
                  <div>
                    {post.content.substring(0, 50)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      <div className="right">
        <PersonOutlinedIcon/>
        <EmailOutlinedIcon/>
        <NotificationsOutlinedIcon/>
        <div className="user">
          <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt=""/>
          <span>John Doe</span>
        </div>
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
