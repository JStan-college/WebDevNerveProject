import React, { useState, useEffect } from 'react';
import "./leftBar.scss";
import { useNavigate } from 'react-router-dom';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';

const LeftBar = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        // Fetch all posts
        const postsRes = await fetch('http://localhost:8080/api/posts');
        if (!postsRes.ok) throw new Error('Failed to fetch posts');
        const posts = await postsRes.json();

        // Calculate total likes per user
        const userLikes = {};
        posts.forEach(post => {
          if (post.user_id) {
            userLikes[post.user_id] = (userLikes[post.user_id] || 0) + (post.likes?.length || 0);
          }
        });

        // Get unique user IDs and sort by like count
        const sortedUserIds = Object.entries(userLikes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(entry => entry[0]);

        // Fetch user details for top users
        const userDetailsPromises = sortedUserIds.map(userId =>
          fetch(`http://localhost:8080/api/users/${userId}`)
            .then(res => res.ok ? res.json() : null)
        );

        const userDetails = await Promise.all(userDetailsPromises);
        
        // Combine user details with like counts
        const leaderboardData = sortedUserIds.map((userId, index) => ({
          rank: index + 1,
          username: userDetails[index]?.username || 'Unknown',
          likeCount: userLikes[userId],
          userId: userId
        }));

        setTopUsers(leaderboardData);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <div className="leftbar">
      <div className="container">
        <div className="leaderboard">
          <div className="leaderboard-header">
            <EmojiEventsOutlinedIcon className="trophy-icon" />
            <h2>Top Users</h2>
          </div>

          {loading ? (
            <div className="loading">Loading leaderboard...</div>
          ) : topUsers.length > 0 ? (
            <div className="leaderboard-list">
              {topUsers.map((user) => (
                <div 
                  key={user.userId} 
                  className={`leaderboard-item rank-${user.rank}`}
                  onClick={() => navigate(`/profile/${user.userId}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="rank-badge">{user.rank}</div>
                  <div className="user-info">
                    <span className="username">{user.username}</span>
                    <span className="likes">{user.likeCount} likes</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-users">No users yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;