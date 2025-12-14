import "./rightBar.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/authContext";

const RightBar = () => {
    const { user, todaysChallenge, loadingChallenge, reload } = useContext(AuthContext);
    const [timeLeft, setTimeLeft] = useState(getTimeUntilEndOfDay());
    const navigate = useNavigate();

    useEffect(() => {
        // update every second
        const t = setInterval(() => setTimeLeft(getTimeUntilEndOfDay()), 1000);
        return () => clearInterval(t);
    }, []);

    function getTimeUntilEndOfDay() {
        const now = new Date();
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);
        const diff = end - now;
        if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return { hours, minutes, seconds };
    }

    function formatTime(t) {
        const z = (v) => String(v).padStart(2, "0");
        return `${z(t.hours)}:${z(t.minutes)}:${z(t.seconds)}`;
    }

    return (
        <div className="rightbar">
            <div className="container">
                <div className="challenge-card">
                    {loadingChallenge ? (
                        <div className="loading">Loading challenge...</div>
                    ) : todaysChallenge ? (
                        <>
                            <div className="ch-header">Today's Challenge</div>
                            <div className="ch-title">{todaysChallenge.title}</div>
                            <div className="ch-genre">{todaysChallenge.genre}</div>
                            <button className="ch-action" onClick={() => navigate('/create')}>Complete it</button>
                        </>
                    ) : (
                        <div className="no-ch">No active challenge</div>
                    )}
                </div>

                <div className="countdown-card">
                    <div className="countdown-label">Time until end of day</div>
                    <div className="countdown-value">{formatTime(timeLeft)}</div>
                </div>
            </div>
        </div>
    );
};

export default RightBar;