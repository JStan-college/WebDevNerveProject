import "./Profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = () => {
  const { id: userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`);
        if (response.ok) {
          const user = await response.json();
          setUserProfile(user);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
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
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [userId]);
  return (
    <div className="profile">
      <div className="images">
        <img src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className="cover"/>
        <img src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load" alt="" className="profilePic"/>
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{userProfile?.username || userProfile?.name || "User"}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon/>
                <span>{userProfile?.location || "Location not specified"}</span>
              </div>
              <div className="item">
                <LanguageIcon/>
                <span>{userProfile?.website || "Website not specified"}</span>
              </div>
            </div>
            <button>follow</button>
          </div>
          <div className="right">
            <EmailOutlinedIcon/>
            <MoreVertIcon/>
          </div>
        </div>
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