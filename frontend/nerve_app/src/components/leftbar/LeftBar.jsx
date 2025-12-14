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
        // Fetch all users
        const usersRes = await fetch('http://localhost:8080/api/users');
        if (!usersRes.ok) throw new Error('Failed to fetch users');
        const users = await usersRes.json();

        // Sort users by reputation in descending order and take top 5
        const topFive = users
          .sort((a, b) => (b.reputation || 0) - (a.reputation || 0))
          .slice(0, 5)
          .map((user, index) => ({
            rank: index + 1,
            username: user.username,
            likeCount: user.reputation || 0,
            userId: user._id || user.id
          }));

        setTopUsers(topFive);
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
                    <span className="likes">{user.likeCount} reputation</span>
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