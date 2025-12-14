import "./navBar.scss";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useNavigate } from "react-router-dom";
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../context/authContext';

const NavBar = () => {

  const {toggle, darkMode} = useContext(DarkModeContext);
  const { user, logout, todaysChallenge, loadingChallenge, reload } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [challengeError, setChallengeError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const notificationsRef = useRef(null);
  const prevChallengeRef = useRef(null);

  let navigate = useNavigate();
  
  useEffect(() => {
    // derive logged-in state from AuthContext user
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (showNotifications && notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showNotifications]);

  // Show a small toast when a todaysChallenge becomes available (e.g., right after login)
  useEffect(() => {
    const prev = prevChallengeRef.current;
    if (!prev && todaysChallenge && isLoggedIn) {
      // only notify once when it appears
      toast.success(`Today's challenge: ${todaysChallenge.title}`);
    }
    prevChallengeRef.current = todaysChallenge;
  }, [todaysChallenge, isLoggedIn]);

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

  const handleProfileClick = () => {
    if (!isLoggedIn || !user) {
      navigate('/login');
      return;
    }
    const userId = user._id || user.id;
    if (!userId) {
      // If user ID is still not available, reload the user data first
      reload().then(() => {
        const id = user._id || user.id;
        if (id) navigate(`/profile/${id}`);
      });
      return;
    }
    navigate(`/profile/${userId}`);
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

  const fetchChallengeIfNeeded = async () => {
    setChallengeError(null);
    try {
      // if not loaded, ask AuthContext to reload (which will fetch challenge)
      if (!todaysChallenge && !loadingChallenge) {
        await reload();
      }
    } catch (err) {
      setChallengeError('Failed to load');
    }
  };

  const toggleNotifications = async () => {
    const next = !showNotifications;
    setShowNotifications(next);
    if (next) {
      await fetchChallengeIfNeeded();
    }
  }

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    try {
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    } catch (e) {
      return false;
    }
  }

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Nerve</span>
        </Link>
        {darkMode ? <WbSunnyOutlinedIcon onClick={toggle}/> : <DarkModeOutlinedIcon onClick={toggle}/>}
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
        <PersonOutlinedIcon onClick={handleProfileClick} style={{cursor: 'pointer'}}/>
        {isLoggedIn && (
          <div className={`notifications ${todaysChallenge ? 'has-challenge' : ''}`} ref={notificationsRef}>
            <NotificationsOutlinedIcon
              onClick={toggleNotifications}
              style={{ cursor: 'pointer' }}
            />
            {showNotifications && (
              <div className="notifications-dropdown">
                {loadingChallenge ? (
                  <div className="nd-loading">Loading...</div>
                ) : challengeError ? (
                  <div className="nd-error">{challengeError}</div>
                ) : todaysChallenge ? (
                  <div className="nd-content">
                    <h4>{todaysChallenge.title}</h4>
                    <p className="genre">{todaysChallenge.genre}</p>
                    <button onClick={() => { navigate(`/create`); setShowNotifications(false); }} className="nd-view-btn">Complete!</button>
                  </div>
                ) : (
                  // If today's challenge is not present but the user was assigned one today
                  // and challengeToday is empty, show 'Challenges completed'.
                  (user && user.challengeAssignedAt && !todaysChallenge && isSameDay(new Date(user.challengeAssignedAt), new Date())) ? (
                    <div className="nd-content">
                      <h4>Challenges completed</h4>
                      <p className="genre">You completed today's challenge</p>
                    </div>
                  ) : (
                    <div className="nd-empty">No challenge assigned</div>
                  )
                )}
              </div>
            )}
          </div>
        )}
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
