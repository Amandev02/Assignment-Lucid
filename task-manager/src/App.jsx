import { useState,useContext } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import CustomNavbar from "./components/header/Header";
import DomainList from "./components/DomainList";
import DNSRecordList from "./components/DNSRecordList";
import ChartComponent from "./components/InteractiveChart";
import Error from "./components/Error";
import Login from "./components/login";
import Register from "./components/register";
import { LoginContext } from "./components/ContextProvider/Context";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { logindata, setLoginData } = useContext(LoginContext);
  let token = localStorage.getItem("usersdatatoken");
  const handleLogin = () => {
    // Implement your login logic
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Implement your logout logic
    setIsAuthenticated(false);
  };

  return (
    <>
      <CustomNavbar
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dns-list" element={<DNSRecordList />} />
          <Route path="/distribution" element={<ChartComponent />} /> 
         
         
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to DNS Manager!</p>
    </div>
  );
}

export default App;

// src/App.js

// import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
// import DomainList from './components/DomainList';
// import DNSRecordList from './components/DNSRecordList';
// import Header from './components/header/Header';

// function App() {
//   return (
//     <Router>
//     <Header/>
//       {/* <div>

//         <nav>
//           <ul>
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/domains">Domains</Link></li>
//             <li><Link to="/dns-records">DNS Records</Link></li>
//           </ul>
//         </nav>

//         <Switch>
//           <Route path="/domains">
//             <DomainList />
//           </Route>
//           <Route path="/dns-records">
//             <DNSRecordList />
//           </Route>
//           <Route path="/">
//             <Home />
//           </Route>
//         </Switch>
//       </div> */}
//     </Router>
//   );
// }

// export default App;
