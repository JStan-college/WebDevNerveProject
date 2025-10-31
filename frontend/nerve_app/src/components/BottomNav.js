import { NavLink} from "react-router-dom";
import { FaHome, FaPlusCircle, FaFileAlt } from "react-icons/fa";
import "./BottomNav.css";

export default function BottomNav() {
    return (
        <nav className="bottom-nav">
            <NavLink to="/" className="nav-link">
                <FaHome color="black"/> 
            </NavLink>
            <NavLink to="/create" className="nav-link">
                <FaPlusCircle color="black"/> 
            </NavLink>
            <NavLink to="/post/:id" className="nav-link" >
                <FaFileAlt color="black"/> 
            </NavLink>
        </nav>
    );
}