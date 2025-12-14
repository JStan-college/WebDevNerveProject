import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { useState, useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")

  const { setUser, reload } = useContext(AuthContext);

  const handleLogin = async(e) => {
    e.preventDefault();
    // Implement login logic here

    try {
      const response =await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password
        }),
    });
    
    const result = await response.json();


    if (response.ok) {
      localStorage.setItem("token", result.token);
      // set user from response if available
      if (result.user) setUser(result.user);
      // always reload to ensure todaysChallenge is fetched and auth state is consistent
      await reload();
      console.log("Logged In!");
      navigate('/', { replace: true });
    } else {
      console.error(result.message);
    }


    console.log("User Logged In:", result);

    setUsername("");
    setPassword("");

    } catch (error) {
      console.error("Error logging in user:", error);
    }
    
  }
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <div className="login">
        <div className="card">
          <button className="back-button" onClick={() => navigate('/')} aria-label="Close">
            <CloseOutlinedIcon />
          </button>
        <div className="left">
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            venenatis, dolor in finibus malesuada, lectus ipsum porta nunc, at
            iaculis arcu nisi sed mauris. Nulla fermentum vestibulum ex, eget
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
          <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" value={username}
  onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button>Login</button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;

