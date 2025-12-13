import { Link } from "react-router-dom";
import "./Register.scss";
import { useState, useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";

const Register = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response =await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email ,
          password
        }),
    });
    
    const result = await response.json();
    console.log("User Created:", result);

    setUsername("");
    setEmail("");
    setPassword("");

    } catch (error) {
      console.error("Error creating user:", error);
    }

  }

  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <div className="register">
        <div className="card">
        <div className="left">
          <h1>Nerve</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            venenatis, dolor in finibus malesuada, lectus ipsum porta nunc, at
            iaculis arcu nisi sed mauris. Nulla fermentum vestibulum ex, eget
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
          <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
            {/*<input type="text" placeholder="Name" />*/}
            <button type="submit">Register</button>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Register;