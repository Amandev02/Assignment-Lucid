import "./header.css";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const CustomNavbar = ({ isAuthenticated, onLogin, onLogout }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>

<nav>
<h1 to="/" className="title">
        DNS RECORDS
      </h1>
    
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
       
            <li><a href="/dns-list">Records</a></li>
            <li><a href="/distribution">Visualize Data</a></li>
        
       
        
      </ul>
    </nav>
     
    </>
  );



};

export default CustomNavbar;



