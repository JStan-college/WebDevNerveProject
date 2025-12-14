import "./Profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
// Place and Language icons removed; social links moved into center info
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { toast } from 'react-hot-toast';
import { AuthContext } from "../../context/authContext";

const Profile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editingMode, setEditingMode] = useState(false);

  // Check if current user is viewing their own profile
  const isOwnProfile = currentUser && (currentUser.id?.toString() === userId || currentUser._id?.toString() === userId);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`);
        if (!response.ok) {
          // If the user doesn't exist (404) or other error, show toast and redirect home
          toast.error('User not found');
          navigate('/');
          return null;
        }
        const user = await response.json();
        setUserProfile(user);
        return user;
      } catch (err) {
        console.error("Error fetching user profile:", err);
        //toast.error('User not found');
        navigate('/');
        return null;
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/posts`);
        if (response.ok) {
          const allPosts = await response.json();
          // Filter posts to only show posts from this user
          const filteredPosts = allPosts.filter(post => post.user_id === userId);
          setUserPosts(filteredPosts);
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };

    const loadProfileData = async () => {
      setLoading(true);
      if (userId) {
        const found = await fetchUserProfile();
        if (!found) {
          setLoading(false);
          return;
        }
        await fetchUserPosts();
        setLoading(false);
      }
    };

    loadProfileData();
  }, [userId]);

  const handleEditProfile = () => {
    setEditUsername(userProfile?.username || "");
    setEditEmail(userProfile?.email || "");
    setEditingMode(true);
    setMenuOpen(false);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: editUsername,
          email: editEmail
        })
      });

      if (response.ok) {
        const result = await response.json();
        setUserProfile(result.user);
        setEditingMode(false);
        alert('Profile updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error updating profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Account deleted successfully');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Error deleting account');
    }
  };

  return (
    <div className="profile">
      <div className="images">
        <img src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className="cover"/>
        <img src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load" alt="" className="profilePic"/>
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          {/* social links moved into center info (left column removed) */}
          <div className="center">
            <span>{userProfile?.username || userProfile?.name || "User"}</span>
            <div className="info">
              <div className="item">
                <a href="http://facebook.com" aria-label="Facebook">
                  <FacebookTwoToneIcon />
                </a>
              </div>
              <div className="item">
                <a href="http://instagram.com" aria-label="Instagram">
                  <InstagramIcon />
                </a>
              </div>
              <div className="item">
                <a href="http://twitter.com" aria-label="Twitter">
                  <TwitterIcon />
                </a>
              </div>
              <div className="item">
                <a href="http://linkedin.com" aria-label="LinkedIn">
                  <LinkedInIcon />
                </a>
              </div>
              <div className="item">
                <a href="http://pinterest.com" aria-label="Pinterest">
                  <PinterestIcon />
                </a>
              </div>
            </div>
            <div className="stats">
              <div className="stat-item">
                <div className="stat-value">{(userProfile?.challengesCompleted ?? 0) + ' / ' + (userProfile?.challengesGiven ?? 0)}</div>
                <div className="stat-label">Completed / Given</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{userProfile?.reputation ?? 0}</div>
                <div className="stat-label">Reputation</div>
              </div>
            </div>
            {/*<button>follow</button>*/}
          </div>
          <div className="right">
            {isOwnProfile && (
              <div className="options-wrapper">
                <MoreVertIcon 
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{ cursor: 'pointer' }}
                />
                {menuOpen && (
                  <div className="menu">
                    <button onClick={handleEditProfile} className="edit-btn">Edit Profile</button>
                    <button onClick={handleDeleteAccount} className="delete-btn">Delete Account</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {editingMode && (
          <div className="edit-modal">
            <div className="modal-content">
              <h2>Edit Profile</h2>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div className="modal-buttons">
                <button onClick={handleSaveProfile} className="save-btn">Save Changes</button>
                <button onClick={() => setEditingMode(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Loading posts...</div>
        ) : (
          <Posts posts={userPosts}/>
        )}
      </div>
    </div>
  );
}

export default Profile;