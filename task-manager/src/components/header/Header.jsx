import "./header.css";
import { useState ,useContext} from "react";
import { Link, NavLink } from "react-router-dom";
import { LoginContext } from "../ContextProvider/Context";

const CustomNavbar = () => {
  const { logindata, setLoginData } = useContext(LoginContext);
  let token = localStorage.getItem("usersdatatoken");
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>

<nav>
<h1 to="/" className="title">
        DNS RECORDS
        
      </h1>
      {
        token ?  (<>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
     
      <ul className={menuOpen ? "open" : ""}>
       
            <li><a href="/dns-list">Records</a></li>
            <li><a href="/distribution">Visualize Data</a></li>
        
            </ul>
            </> ): <span></span> 
      }
      
    </nav>
     
    </>
  );



};

export default CustomNavbar;



